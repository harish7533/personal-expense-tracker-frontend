/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
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
  LineChart,
  Pie,
  Cell,
  Legend,
  Line,
} from "recharts";
import Navbar from "../components/Navbar";
import "../styles/DashBoard.css";
import Page from "../components/Page";
import { useAuth } from "../context/AuthContext";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import PageWrapper from "../components/layouts/PageWrapper";
import type { Transaction } from "../context/FincanceContext";
import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  ArrowDownCircle,
  IndianRupee,
} from "lucide-react";

interface Props {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: Props) {
  const { user, loading, token } = useAuth();

  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [storeWise, setStoreWise] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string>("");
  const [revealed, setRevealed] = useState(false);
  const [hasBills, setHasBills] = useState(true);
  const storeColorMap: Record<string, string> = {};
  const [mode, setMode] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");

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
     BUILD CUMULATIVE DATA
  ========================== */

  const chartData = useMemo(() => {
    let balance = 0;

    return transactions
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map((t) => {
        if (t.type === "income") balance += t.amount;
        else balance -= t.amount;

        return {
          date: new Date(t.created_at).toLocaleDateString(),
          balance,
        };
      });
  }, [transactions]);

  const latest = chartData[chartData.length - 1]?.balance || 0;
  const previous = chartData[chartData.length - 2]?.balance || latest;

  const isUpTrend = latest >= previous;

  const handleAddTransaction = () => {
    if (!amount) return;

    console.log({
      type: mode,
      amount: Number(amount),
    });

    setAmount("");
  };

  const today = new Date().toDateString();

  const dailyExpense = transactions
    .filter(
      (t) =>
        t.type === "expense" && new Date(t.created_at).toDateString() === today,
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expensePercent =
    totalIncome > 0 ? (dailyExpense / totalIncome) * 100 : 0;

  const safePercent = Math.min(expensePercent, 100);

  const getExpenseColor = () => {
    if (safePercent < 40) return "#22c55e"; // green
    if (safePercent < 75) return "#facc15"; // yellow
    return "#ef4444"; // red
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

    const [storeRes] = await Promise.all([
      api.get("/analytics/store", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }),
    ]);

    setStoreWise(storeRes.data);
  };

  const loadAnalytics = async () => {
    try {
      setError("");

      if (user?.role === "ADMIN") {
        await fetchAdminAnalytics();
      } else {
        const res = await api.get("/analytics/monthly", {
          headers: { Authorization: `Bearer ${token}` },
          params: buildParams(),
        });

        const resDaily = await api.get("/analytics/daily", {
          headers: { Authorization: `Bearer ${token}`},
          params: buildParams(),
        })

        if (!res.data || res.data.length === 0 && !resDaily.data || resDaily.data.length === 0) {
          setHasBills(false);
        } else {
          setMonthly(res.data);
          setDaily(resDaily.data);
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
            <h1>⚠️ {error}</h1>
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
                <div className="modern-user-dashboard">
                  <div className="top-grid">
                    {/* ================= INCOME/EXPENSE CARD ================= */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="income-expense-card glass-card"
                    >
                      <div className="card-header">
                        <h2 className="heading">Add Transaction</h2>

                        <div className="mode-buttons">
                          <button
                            onClick={() => setMode("income")}
                            className={mode === "income" ? "active-income" : ""}
                          >
                            Income
                          </button>

                          <button
                            onClick={() => setMode("expense")}
                            className={
                              mode === "expense" ? "active-expense" : ""
                            }
                          >
                            Expense
                          </button>
                        </div>
                      </div>

                      <div className="transaction-inputs">
                        <input
                          type="number"
                          placeholder="Enter amount..."
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />

                        <div className="input-icon">
                          {mode === "income" ? (
                            <IndianRupee size={18} />
                          ) : (
                            <ArrowDownCircle size={18} />
                          )}
                        </div>

                        <button
                          onClick={handleAddTransaction}
                          className={`add-btn ${mode}`}
                        >
                          Add {mode}
                        </button>
                      </div>
                    </motion.div>

                    {/* ================= EXPENSE WHEEL CARD ================= */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="expense-wheel-card glass-card"
                    >
                      <h2 className="heading">Daily Expense Usage</h2>

                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          {/* Background Circle */}
                          <path
                            d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="3.5"
                            className="circle-bg"
                          />

                          {/* Animated Progress */}
                          <motion.path
                            d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={getExpenseColor()}
                            strokeWidth="3.5"
                            strokeDasharray={`${safePercent}, 100`}
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{ strokeDasharray: `${safePercent}, 100` }}
                            transition={{ duration: 1.2 }}
                            className="circle-bg-progress"
                          />
                        </svg>

                        {/* Center Content */}
                        <div className="center-content">
                          <div style={{ color: getExpenseColor() }}>
                            {safePercent.toFixed(1)}%
                          </div>
                          <div className="label">of total income</div>
                        </div>
                      </div>

                      <div className="today-spent">
                        <p>Today Spent</p>
                        <p className="amount">
                          <IndianRupee size={12} /> {dailyExpense.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>

                    {/* ================= GRAPH CARD ================= */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="graph-card glass-card"
                    >
                      <div className="flex-row">
                        <h2 className="heading">Portfolio Trend</h2>

                        <div className={`trend ${isUpTrend ? "up" : "down"}`}>
                          {isUpTrend ? (
                            <TrendingUp size={18} />
                          ) : (
                            <TrendingDown size={18} />
                          )}
                          <span className="font-semibold">
                            {latest.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="rgba(255,255,255,0.05)"
                            />

                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              stroke="#8884d8"
                            />

                            <YAxis tick={{ fontSize: 12 }} stroke="#8884d8" />

                            <Tooltip
                              contentStyle={{
                                background: "rgba(30,30,30,0.9)",
                                border: "none",
                                borderRadius: "12px",
                              }}
                            />

                            <Line
                              type="monotone"
                              dataKey="balance"
                              stroke={isUpTrend ? "#22c55e" : "#ef4444"}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{
                                r: 6,
                                fill: isUpTrend ? "#22c55e" : "#ef4444",
                              }}
                              isAnimationActive
                              animationDuration={1000}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* LIVE MOVING DOT */}
                      <motion.div
                        className={`live-dot ${
                          isUpTrend ? "up-trend" : "down-trend"
                        }`}
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                        }}
                      />
                    </motion.div>

                    {/* ================= SUMMARY CARD ================= */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="summary-card glass-card"
                    >
                      <h2 className="heading">Balance Summary</h2>

                      <div className="balance">{latest.toFixed(2)}</div>

                      <div
                        className={`trend-summary ${isUpTrend ? "up" : "down"}`}
                      >
                        {isUpTrend ? (
                          <TrendingUp size={18} />
                        ) : (
                          <TrendingDown size={18} />
                        )}
                        <span>
                          {isUpTrend
                            ? "Uptrend detected"
                            : "Downtrend detected"}
                        </span>
                      </div>
                    </motion.div>

                    {/* ===== TRANSACTION LIST ===== */}
                    <div className="glass-card">
                      <h3>Recent Transactions</h3>

                      <div className="transaction-list">
                        {daily.slice(-5).map((tx: any, index: number) => (
                          <div key={index} className="transaction-item">
                            <div className="tx-icon">💸</div>
                            <div className="tx-info">
                              <p>{tx.date}</p>
                              <span>₹ {tx.total}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Page>
        </>
      )}
    </PageWrapper>
  );
}
