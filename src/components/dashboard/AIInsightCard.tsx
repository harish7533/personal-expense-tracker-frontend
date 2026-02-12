import { useEffect } from "react";
import { motion } from "framer-motion";
import { useFinance } from "../../context//FincanceContext";
import { generateInsights } from "../../utils/financeInsights";

export default function AIInsightCard() {
  const { income, expense, transactions } = useFinance();

  useEffect(() => {
    const ratio = income > 0 ? (expense / income) * 100 : 0;

    if (ratio > 90 && Notification.permission === "granted") {
      new Notification("Overspending Alert 🚨", {
        body: "You have used over 90% of your income.",
      });
    }
  }, [income, expense]);

  const insight = generateInsights(income, expense, transactions.length);

  const statusColors = {
    good: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
  };

  return (
    <motion.div
      className="glass-card insight-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="insight-header">
        <span
          className="status-dot"
          style={{ background: statusColors[insight.status] }}
        />
        <h3>AI Financial Insight</h3>
      </div>

      <h4 style={{ color: statusColors[insight.status] }}>{insight.title}</h4>

      <p>{insight.message}</p>
    </motion.div>
  );
}
