/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../api";

type BalanceContextType = {
  balance: number;
  loading: boolean;
  refreshBalance: () => Promise<void>;
  setInitialBalance: (amount: number) => Promise<void>;
  updateBalance: (updater: (prev: number) => number) => void;
};

const BalanceContext = createContext<BalanceContextType | undefined>(
  undefined
);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= FETCH BALANCE ================= */
  const refreshBalance = async () => {
    try {
      const res = await api.get("/balance/me");
      setBalance(Number(res.data.balance || 0));
    } catch (err) {
      console.error("Failed to fetch balance", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SET INITIAL BALANCE ================= */
  const setInitialBalance = async (amount: number) => {
    try {
      await api.post("/balance/set", { amount });
      setBalance(amount);
    } catch (err) {
      console.error("Failed to set balance", err);
    }
  };

  /* ================= UPDATE (RUNTIME) ================= */
  const updateBalance = (updater: (prev: number) => number) => {
    setBalance((prev) => updater(prev));
  };

  useEffect(() => {
    refreshBalance();
  }, []);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        loading,
        refreshBalance,
        setInitialBalance,
        updateBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within BalanceProvider");
  }
  return context;
}
