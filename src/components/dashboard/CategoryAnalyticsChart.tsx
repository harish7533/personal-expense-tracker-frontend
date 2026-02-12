/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFinance } from "../../context/FincanceContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function CategoryAnalyticsChart() {
  const { transactions } = useFinance();

  const categoryData = transactions
    .filter(t => t.type === "expense")
    .reduce((acc: any, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += Number(t.amount);
      return acc;
    }, {});

  const formatted = Object.keys(categoryData).map(key => ({
    name: key,
    value: categoryData[key],
  }));

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <div className="glass-card">
      <h3>Expense by Category</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={formatted}
            dataKey="value"
            outerRadius={90}
            label
          >
            {formatted.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
