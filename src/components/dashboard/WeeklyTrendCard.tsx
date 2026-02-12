import { motion } from "framer-motion";
import { useFinance } from "../../context/FincanceContext";
import { calculateWeeklyTrend } from "../../utils/weeklyTrend";

export default function WeeklyTrendCard() {
  const { transactions } = useFinance();

  const { incomeChange, expenseChange } =
    calculateWeeklyTrend(transactions);

  const getColor = (value: number, positiveGood = true) => {
    if (positiveGood) {
      return value >= 0 ? "#22c55e" : "#ef4444";
    }
    return value <= 0 ? "#22c55e" : "#ef4444";
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>Weekly Trend</h3>

      <p style={{ color: getColor(incomeChange) }}>
        Income: {incomeChange.toFixed(1)}%
      </p>

      <p style={{ color: getColor(expenseChange, false) }}>
        Expense: {expenseChange.toFixed(1)}%
      </p>
    </motion.div>
  );
}
