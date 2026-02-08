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
import { useNavigate } from "react-router-dom";
import "../styles/DashBoard.css";
import Page from "../components/Page";

export default function Dashboard() {
  const navigate = useNavigate();

  const CHART_COLORS = [
    "#22c55e",
    "#6366f1",
    "#f97316",
    "#06b6d4",
    "#a855f7",
    "#ef4444",
  ];

  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [storeWise, setStoreWise] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  /* =========================
     THEME DETECTION
  ========================= */
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";

  const tooltipStyle = {
    backgroundColor: isDark ? "#020617" : "#ffffff",
    border: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
    color: isDark ? "#e5e7eb" : "#111827",
  };

  /* =========================
     AUTH GUARD
  ========================= */
  useEffect(() => {
    if (!token || !role) {
      navigate("/login", { replace: true });
    }
  }, [token, role, navigate]);

  /* =========================
     FETCH ANALYTICS
  ========================= */
  const fetchAdminAnalytics = async () => {
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

    setMonthly(monthlyRes.data);
    setStoreWise(storeRes.data);
    setDaily(dailyRes.data);
  };

  const fetchUserAnalytics = async () => {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const dailyRes = await api.get("/bills/user/analytics/daily", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    setDaily(dailyRes.data);
  };

  const loadAnalytics = async () => {
    try {
      if (role === "ADMIN") {
        await fetchAdminAnalytics();
      } else {
        await fetchUserAnalytics();
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <Navbar />
      <Page>
              <div className="dashboard-page">
        {/* ================= ADMIN ================= */}
        {role === "ADMIN" && (
          <div className="dashboard-content">
            <h2>📊 Admin Dashboard</h2>

            {/* Date Filters */}
            <div className="dashboard-filters">
              <label>
                From:
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </label>

              <label>
                To:
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </label>

              <button className="submit" onClick={loadAnalytics} style={{ width: 100, marginTop: 20 }}>
                Apply
              </button>
            </div>

            <h3>Monthly Spend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthly}>
                <XAxis dataKey="month" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {monthly.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <h3>Store-wise Spend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storeWise}>
                <XAxis dataKey="store" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {storeWise.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <h3>Daily Spend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daily}>
                <XAxis dataKey="date" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {daily.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i % 2 === 0 ? "#22c55e" : "#16a34a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ================= USER ================= */}
        {role === "USER" && (
          <div className="dashboard-content">
            <h2>📈 Your Daily Spend</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daily}>
                <XAxis dataKey="date" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {daily.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i % 2 === 0 ? "#22c55e" : "#16a34a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      </Page>
    </>
  );
}
