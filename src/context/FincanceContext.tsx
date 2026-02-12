/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string,
  description: string;
  created_at: string;
}

interface FinanceContextType {
  income: number;
  expense: number;
  transactions: Transaction[];
  addTransaction: (
    type: "income" | "expense",
    amount: number,
    description: string,
    category: string,
  ) => Promise<void>;
  loading: boolean;
  goal: number;
  setSavingsGoal: ( amount: number ) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const FinanceProvider = ({ children }: any) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goal, setGoal] = useState<number>(0);
  const [loading] = useState(true);

  // Fetch Transactions
  //   useEffect(() => {
  //     if (!user) return;

  //     const fetchTransactions = async () => {
  //       const { data, error } = await supabase
  //         .from("transactions")
  //         .select("*")
  //         .order("created_at", { ascending: false });

  //       if (!error && data) {
  //         setTransactions(data);
  //       }

  //       setLoading(false);
  //     };

  //     fetchTransactions();
  //   }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-transactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTransactions((prev) => [payload.new as Transaction, ...prev]);
          }
        },
      )
      .subscribe();

    const fetchGoal = async () => {
      const { data } = await supabase.from("savings_goal").select("*").single();

      if (data) {
        setGoal(Number(data.target_amount));
      }
    };

    fetchGoal();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Add Transaction
  const addTransaction = async (
    type: "income" | "expense",
    amount: number,
    description: string,
    category: string,
  ) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type,
          amount,
          description,
          category
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setTransactions((prev) => [data, ...prev]);
    }
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const setSavingsGoal = async (amount: number) => {
    if (!user) return;

    await supabase.from("savings_goal").upsert({
      user_id: user.id,
      target_amount: amount,
    });

    setGoal(amount);
  };

  return (
    <FinanceContext.Provider
      value={{
        income,
        expense,
        transactions,
        addTransaction,
        loading,
        goal,
        setSavingsGoal,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("Must use inside provider");
  return context;
};
