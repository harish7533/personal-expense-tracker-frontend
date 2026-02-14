import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../../context/FincanceContext";

import StatCard from "./StatCard";
import IncomeExpenseToggle from "./IncomeExpenseToggle";
import ExpensePieChart from "./ExpensePieChart";
import IncomeWheel from "./IncomeWheel";
import TransactionTimeline from "./TransactionTimeline";
import AIInsightCard from "./AIInsightCard";
import WeeklyTrendCard from "./WeeklyTrendCard";
import MonthlyAnalyticsChart from "./MonthlyAnalyticsChart";
import SavingsGoalCard from "./SavingsGoalCard";
import CategoryAnalyticsChart from "./CategoryAnalyticsChart";
import EnableNotificationCard from "../EnableNotificationCard";

import "../../styles/DashBoardLayout.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

export default function DashboardLayout() {
  const { income, expense } = useFinance();
  const navigate = useNavigate();

  const remaining = income - expense;

  return (
    <>
      {/* Notification Permission Card */}
      <EnableNotificationCard />

      <motion.div
        className="dashboard-container"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* ===== TOP STATS SECTION ===== */}
        <div className="dashboard-top">
          <div className="left-stack">
            <StatCard
              title="Income"
              amount={income}
              type="income"
              onView={() => navigate("/dashboard/income-details")}
            />
            <IncomeWheel remaining={remaining} total={income} />
          </div>

          <div className="right-stack">
            <StatCard
              title="Expense"
              amount={expense}
              type="expense"
              onView={() => navigate("/dashboard/expense-details")}
            />
            <ExpensePieChart income={income} expense={expense} />
          </div>
        </div>

        {/* ===== ACTION + AI ===== */}
        <div className="dashboard-mid">
          <IncomeExpenseToggle />
          <AIInsightCard />
        </div>

        {/* ===== FULL WIDTH ANALYTICS ===== */}
        <WeeklyTrendCard />
        <MonthlyAnalyticsChart />

        {/* ===== SIDE ANALYTICS ===== */}
        <div className="dashboard-bottom">
          <SavingsGoalCard />
          <CategoryAnalyticsChart />
        </div>

        {/* ===== TIMELINE ===== */}
        <TransactionTimeline />
      </motion.div>
    </>
  );
}
