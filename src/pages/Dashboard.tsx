/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Navbar from "../components/Navbar";
import "../styles/DashBoard.css";
import Page from "../components/Page";
import { useAuth } from "../context/AuthContext";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import PageWrapper from "../components/layouts/PageWrapper";
import BalanceCard from "../components/BalanceCard";

export default function Dashboard() {
  const { user, loading, token } = useAuth();

  // const CHART_COLORS = [
  //   "#22c55e",
  //   "#6366f1",
  //   "#f97316",
  //   "#06b6d4",
  //   "#a855f7",
  //   "#ef4444",
  // ];

  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [storeWise, setStoreWise] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string>("");
  const [revealed, setRevealed] = useState(false);
  const [hasBills, setHasBills] = useState(true);
  const storeColorMap: Record<string, string> = {};

  /* =========================
     THEME TOOLTIP
  ========================= */
  const tooltipStyle = {
    backgroundColor: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    color: "var(--text)",
  };

  const getStoreColor = (store: string) => {
    if (!storeColorMap[store]) {
      const hue = Math.floor(Math.random() * 360);
      storeColorMap[store] = `hsl(${hue}, 70%, 55%)`;
    }
    return storeColorMap[store];
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

      if (user?.role === "ADMIN") {
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
          <div
            style={{ textAlign: "center", padding: 80, color: "var(--text)" }}
          >
            <h1>⚠️ Something went wrong</h1>
            <p>Please try again later</p>
          </div>
        </>
      ) : !hasBills ? (
        <>
          <Navbar />
          <div
            style={{ textAlign: "center", padding: 60, color: "var(--text)" }}
          >
            <h2>No bills yet 🧾</h2>
            <p>Add your first bill to see analytics</p>
          </div>
        </>
      ) : !user ? (
        <>
          <Navbar />
          <p
            style={{ textAlign: "center", marginTop: 40, color: "var(--text)" }}
          >
            Please login to view dashboard
          </p>
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

                  <h3 className="chart-title">Monthly Spend</h3>

                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={monthly}>
                      <defs>
                        <linearGradient
                          id="colorSpend"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--primary)"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--primary)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis dataKey="month" stroke="var(--muted)" />
                      <YAxis stroke="var(--muted)" />
                      <Tooltip contentStyle={tooltipStyle} />

                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fill="url(#colorSpend)"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <h3 className="chart-title">Store-wise Spend</h3>

                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Tooltip contentStyle={tooltipStyle} />

                      <Pie
                        data={storeWise}
                        dataKey="total"
                        nameKey="store"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                      >
                        {storeWise.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getStoreColor(entry.store)}
                          />
                        ))}
                      </Pie>

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* ================= USER ================= */}
              {user.role === "USER" && (
                <>
                  <BalanceCard />
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

                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={daily}>
                        <defs>
                          <linearGradient
                            id="colorDaily"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#22c55e"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="100%"
                              stopColor="#22c55e"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis dataKey="date" stroke="var(--muted)" />
                        <YAxis stroke="var(--muted)" />
                        <Tooltip contentStyle={tooltipStyle} />

                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="#22c55e"
                          strokeWidth={2}
                          fill="url(#colorDaily)"
                        />
                      </AreaChart>
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
