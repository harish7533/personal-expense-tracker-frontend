import { PieChart, Pie, Cell } from "recharts";

export default function ExpensePieChart({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) {
  const data = [
    { name: "Expense", value: expense },
    { name: "Remaining", value: income - expense },
  ];

  return (
    <div className="glass-card">
      <h3>Expense Usage</h3>

      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          outerRadius={100}
        >
          <Cell fill="#ef4444" />
          <Cell fill="#22c55e" />
        </Pie>
      </PieChart>
    </div>
  );
}
