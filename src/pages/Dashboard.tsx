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

        if (!res.data || res.data.length === 0) {
          setHasBills(false);
        } else {
          setMonthly(res.data);
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
                <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:text-white">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ================= INCOME/EXPENSE CARD ================= */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl p-6 mb-6"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">
                          Add Transaction
                        </h2>

                        <div className="flex bg-white/10 rounded-xl p-1">
                          <button
                            onClick={() => setMode("income")}
                            className={`px-4 py-1 rounded-lg transition ${
                              mode === "income"
                                ? "bg-green-500 text-white"
                                : "text-gray-400"
                            }`}
                          >
                            Income
                          </button>

                          <button
                            onClick={() => setMode("expense")}
                            className={`px-4 py-1 rounded-lg transition ${
                              mode === "expense"
                                ? "bg-red-500 text-white"
                                : "text-gray-400"
                            }`}
                          >
                            Expense
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            placeholder="Enter amount..."
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />

                          <div className="absolute right-3 top-3 text-gray-400">
                            {mode === "income" ? (
                              <IndianRupee size={18} />
                            ) : (
                              <ArrowDownCircle size={18} />
                            )}
                          </div>
                        </div>

                        <button
                          onClick={handleAddTransaction}
                          className={`px-6 py-3 rounded-xl font-semibold transition ${
                            mode === "income"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          } text-white`}
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
                      className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl p-6 flex flex-col items-center justify-center"
                    >
                      <h2 className="text-lg font-semibold mb-6">
                        Daily Expense Usage
                      </h2>

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
                          />
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div
                            className="text-3xl font-bold"
                            style={{ color: getExpenseColor() }}
                          >
                            {safePercent.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-400">
                            of total income
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 text-center space-y-1">
                        <p className="text-sm text-gray-400">Today Spent</p>
                        <p className="text-lg font-semibold text-red-400">
                          ₹ {dailyExpense.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>

                    {/* ================= GRAPH CARD ================= */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl backdrop-blur-lg bg-white/5 dark:bg-white/5 border border-white/10 shadow-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                          Portfolio Trend
                        </h2>

                        <div
                          className={`flex items-center gap-2 ${
                            isUpTrend ? "text-green-400" : "text-red-400"
                          }`}
                        >
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

                      <div className="h-72">
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
                        className={`w-3 h-3 rounded-full mt-4 ${
                          isUpTrend ? "bg-green-400" : "bg-red-400"
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
                      className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl p-6"
                    >
                      <h2 className="text-lg font-semibold mb-6">
                        Balance Summary
                      </h2>

                      <div className="text-4xl font-bold mb-4">
                        {latest.toFixed(2)}
                      </div>

                      <div
                        className={`flex items-center gap-2 ${
                          isUpTrend ? "text-green-400" : "text-red-400"
                        }`}
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
