/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { Transaction } from "../context/FincanceContext";

export const useFinanceHook = (transactions: Transaction[]) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const monthlyLimit = 20000; // You can fetch this from Supabase later

  useEffect(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  }, [transactions]);

  // 🔥 Overspending watcher
  useEffect(() => {
    if (
      totalExpense > monthlyLimit &&
      Notification.permission === "granted"
    ) {
      new Notification("⚠ Overspending Alert", {
        body: "You have exceeded your monthly limit!",
      });
    }
  }, [totalExpense]);

  return {
    totalIncome,
    totalExpense,
    monthlyLimit,
  };
};
