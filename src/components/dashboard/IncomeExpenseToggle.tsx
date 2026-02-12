import { useState } from "react";
import { useFinance } from "../../context/FincanceContext";

export default function IncomeExpenseToggle() {
  const { addTransaction } = useFinance();
  const [active, setActive] = useState<"income" | "expense" | null>(null);
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!active || amount <= 0) return;

    addTransaction(active, amount, description, category);

    setAmount(0);
    setDescription("");
    setActive(null);
  };

  return (
    <div className="glass-card">
      <div className="toggle-buttons">
        <button
          className={active === "income" ? "active-income" : ""}
          onClick={() => setActive("income")}
        >
          + Income
        </button>

        <button
          className={active === "expense" ? "active-expense" : ""}
          onClick={() => setActive("expense")}
        >
          - Expense
        </button>
      </div>

      {active && (
        <div className="form-card">
          <input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Rent</option>
            <option>General</option>
          </select>

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSubmit}>Add</button>
        </div>
      )}
    </div>
  );
}
