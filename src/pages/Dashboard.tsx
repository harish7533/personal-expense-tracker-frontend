/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const CHART_COLORS = [
    "#22c55e", // green
    "#6366f1", // indigo
    "#f97316", // orange
    "#06b6d4", // cyan
    "#a855f7", // purple
    "#ef4444", // red
  ];

  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [storeWise, setStoreWise] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const role = localStorage.getItem("role");

  const token = localStorage.getItem("token");

  const fetchAnalytics = async () => {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const [monthlyRes, storeRes, dailyRes] = await Promise.all([
      api.get("/bills/admin/analytics/monthly", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }),
      api.get("/bills/admin/analytics/store", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }),
      api.get("/bills/admin/analytics/daily", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }),
    ]);

    return {
      monthly: monthlyRes.data,
      storeWise: storeRes.data,
      daily: dailyRes.data,
    };
  };

  const loadAnalytics = async () => {
    try {
      const data = await fetchAnalytics();
      setMonthly(data.monthly);
      setStoreWise(data.storeWise);
      setDaily(data.daily);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      {role === "ADMIN" ? (
        <div style={{ padding: 20 }}>
          <h2>📊 Admin Dashboard</h2>

          {/* Date Filter */}
          <div style={{ marginBottom: 20 }}>
            <label>From: </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />

            <label style={{ marginLeft: 10 }}>To: </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />

            <button
              style={{ marginTop: 20, width: 100 }}
              onClick={loadAnalytics}
              className="submit"
            >
              Apply
            </button>
          </div>

          <h3>Monthly Spend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {monthly.map((_, index) => (
                  <Cell
                    key={`month-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <h3>Store-wise Spend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeWise}>
              <XAxis dataKey="store" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {storeWise.map((_, index) => (
                  <Cell
                    key={`store-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <h3>Daily Spend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={daily}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {daily.map((_, index) => (
                  <Cell
                    key={`daily-${index}`}
                    fill={index % 2 === 0 ? "#22c55e" : "#16a34a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ padding: "24px" }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      )}
    </>
  );
}
