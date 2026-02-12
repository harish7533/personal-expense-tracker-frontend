import { useFinance } from "../../context/FincanceContext";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionTimeline() {
  const { transactions } = useFinance();

  return (
    <div className="glass-card timeline-container">
      <h3>Transaction History</h3>

      <div className="timeline-scroll">
        <AnimatePresence>
          {transactions.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`chat-bubble ${t.type}`}
            >
              <div className="bubble-content">
                <p className="desc">{t.description}</p>
                <span className="date">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="amount">
                {t.type === "income" ? "+" : "-"} {t.amount}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
