/* eslint-disable react-hooks/rules-of-hooks */
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
import "../styles/DashBoard.css";
import Page from "../components/Page";
import { useAuth } from "../auth/AuthContext";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import PageWrapper from "../components/layouts/PageWrapper";
import BalanceCard from "../components/BalanceCard";

export default function Dashboard() {
  const { user, loading, token } = useAuth();

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
  const [error, setError] = useState<string>("");
  const [revealed, setRevealed] = useState(false);
  const [hasBills, setHasBills] = useState(true);

  if (!user) {
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        Please login to view dashboard
      </p>
    );
  }

  /* =========================
     THEME TOOLTIP
  ========================= */
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  const tooltipStyle = {
    backgroundColor: isDark ? "#020617" : "#ffffff",
    border: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
    color: isDark ? "#e5e7eb" : "#111827",
  };

  /* =========================
     FETCH ANALYTICS
  ========================= */
  const buildParams = () => {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return params;
  };

  const fetchAdminAnalytics = async () => {
    const params = buildParams();

    const [monthlyRes, storeRes, dailyRes] = await Promise.all([
      api.get("/analytics/monthly", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }),
      api.get("/analytics/store", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }),
      api.get("/analytics/daily", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }),
    ]);

    setMonthly(monthlyRes.data);
    setStoreWise(storeRes.data);
    setDaily(dailyRes.data);
  };

  // const fetchUserAnalytics = async () => {
  //   const params = buildParams();

  //   const dailyRes = await api.get("/bills/analytics/daily", {
  //     headers: { Authorization: `Bearer ${token}` },
  //     params,
  //   });

  //   setDaily(dailyRes.data);
  // };

  const loadAnalytics = async () => {
    try {
      setError("");

      if (user.role === "ADMIN") {
        await fetchAdminAnalytics();
      } else {
        const res = await api.get("/analytics/daily", {
          headers: { Authorization: `Bearer ${token}` },
          params: buildParams(),
        });

        if (!res.data || res.data.length === 0) {
          setHasBills(false);
        } else {
          setDaily(res.data);
        }
      }

      setTimeout(() => setRevealed(true), 50);
    } catch (err: any) {
      console.error("Failed to load analytics", err);

      if (err?.response?.status === 404) {
        setHasBills(false); // 🔥 EXPECTED for new users
      } else {
        setError("Something went wrong while loading dashboard");
      }
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
    <PageWrapper>
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <>
        <Navbar />
          <div style={{ textAlign: "center", padding: 80 }}>
            <h1>⚠️ Something went wrong</h1>
            <p>Please try again later</p>
          </div>
        </>
      ) : !hasBills ? (
        <>
          <Navbar />
          <div style={{ textAlign: "center", padding: 60 }}>
            <h2>No bills yet 🧾</h2>
            <p>Add your first bill to see analytics</p>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <Page>
            <div className={`dashboard-page fade-in ${revealed ? "show" : ""}`}>
              {/* ================= ADMIN ================= */}
              {user.role === "ADMIN" && (
                <div className="dashboard-content">
                  <h2>📊 Admin Dashboard</h2>

                  {/* Filters */}
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

                    <button className="submit" onClick={loadAnalytics}>
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
                </div>
              )}

              {/* ================= USER ================= */}
              {user.role === "USER" && (
                <>
                <BalanceCard/>
                <div className="dashboard-content">
                  <h2>📊 User Dashboard</h2>
                  <h3>📈 Your Daily Spend</h3>

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

                    <button className="submit" onClick={loadAnalytics}>
                      Apply
                    </button>
                  </div>

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
                </>
              )}
            </div>
          </Page>
        </>
      )}
    </PageWrapper>
  );
}
