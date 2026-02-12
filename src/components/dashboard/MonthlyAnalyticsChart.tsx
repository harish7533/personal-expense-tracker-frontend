/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFinance } from "../../context/FincanceContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyAnalyticsChart() {
  const { transactions } = useFinance();

  const monthlyData = transactions.reduce((acc: any, t) => {
    const month = new Date(t.created_at).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      acc[month].income += Number(t.amount);
    } else {
      acc[month].expense += Number(t.amount);
    }

    return acc;
  }, {});

  const formatted = Object.values(monthlyData);

  return (
    <div className="glass-card">
      <h3>Monthly Analytics</h3>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={formatted}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            fill="#22c55e33"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            fill="#ef444433"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
