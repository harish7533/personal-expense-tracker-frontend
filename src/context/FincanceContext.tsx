/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
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
    category: string
  ) => Promise<void>;
  loading: boolean;
  goal: number;
  monthlyLimit: number;
  overspending: boolean;
  setSavingsGoal: (amount: number) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const FinanceProvider = ({ children }: any) => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goal, setGoal] = useState<number>(0);
  const [monthlyLimit] = useState<number>(20000); // later fetch from DB
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);

  /* -----------------------------
     Fetch Transactions Initially
  ------------------------------ */
  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setTransactions(data);

      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  /* -----------------------------
     Realtime Subscription
  ------------------------------ */
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  /* -----------------------------
     Fetch Savings Goal
  ------------------------------ */
  useEffect(() => {
    if (!user) return;

    const fetchGoal = async () => {
      const { data } = await supabase
        .from("savings_goal")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setGoal(Number(data.target_amount));
      }
    };

    fetchGoal();
  }, [user]);

  /* -----------------------------
     Calculations
  ------------------------------ */
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const overspending = expense > monthlyLimit;

  /* -----------------------------
     Overspending Notification
  ------------------------------ */
  useEffect(() => {
    if (
      overspending &&
      Notification.permission === "granted" &&
      !notified
    ) {
      new Notification("⚠ Overspending Alert", {
        body: "You have exceeded your monthly budget!",
      });

      setNotified(true);
    }

    if (!overspending) {
      setNotified(false);
    }
  }, [overspending, notified]);

  /* -----------------------------
     Add Transaction
  ------------------------------ */
  const addTransaction = async (
    type: "income" | "expense",
    amount: number,
    description: string,
    category: string
  ) => {
    if (!user) return;

    const { data } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type,
          amount,
          description,
          category,
        },
      ])
      .select()
      .single();

    if (data) {
      setTransactions((prev) => [data, ...prev]);
    }
  };

  /* -----------------------------
     Savings Goal
  ------------------------------ */
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
        monthlyLimit,
        overspending,
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
