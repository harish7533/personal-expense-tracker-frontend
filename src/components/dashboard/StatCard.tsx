import { motion } from "framer-motion";

interface Props {
  title: string;
  amount: number;
  type: "income" | "expense";
  onView: () => void;
}

export default function StatCard({ title, amount, type, onView }: Props) {
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h3>{title}</h3>

      <motion.h2
        key={amount}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{ color: type === "income" ? "#22c55e" : "#ef4444" }}
      >
        {type === "income" ? "+" : "-"} {amount}
      </motion.h2>

      <button className="view-btn" onClick={onView}>
        View More →
      </button>
    </motion.div>
  );
}

