import { motion } from "framer-motion";
import { useFinance } from "../../context//FincanceContext";
import { useState } from "react";

export default function SavingsGoalCard() {
  const { income, expense, goal, setSavingsGoal } = useFinance();
  const [input, setInput] = useState(goal);

  const savings = income - expense;
  const progress = goal ? (savings / goal) * 100 : 0;

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>Savings Goal</h3>

      {goal === 0 ? (
        <>
          <input
            type="number"
            placeholder="Set Goal Amount"
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
          <button onClick={() => setSavingsGoal(input)}>
            Set Goal
          </button>
        </>
      ) : (
        <>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <p>
            {progress.toFixed(1)}% of {goal}
          </p>
        </>
      )}
    </motion.div>
  );
}
