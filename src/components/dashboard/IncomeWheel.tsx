import { PieChart, Pie, Cell } from "recharts";

interface Props {
  remaining: number;
  total: number;
}

export default function IncomeWheel({ remaining, total }: Props) {
  const used = total - remaining;
  const percent = total ? (remaining / total) * 100 : 0;

  const data = [
    { name: "Remaining", value: remaining },
    { name: "Used", value: used },
  ];

  return (
    <div className="glass-card">
      <h3>Income Remaining</h3>

      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
        >
          <Cell fill="#22c55e" />
          <Cell fill="#ef4444" />
        </Pie>
      </PieChart>

      <h2>{percent.toFixed(1)}%</h2>
    </div>
  );
}
