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
        className="dashboard-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Income Card */}
        <StatCard
          title="Income"
          amount={income}
          type="income"
          onView={() => navigate("/dashboard/income-details")}
        />

        {/* Expense Card */}
        <StatCard
          title="Expense"
          amount={expense}
          type="expense"
          onView={() => navigate("/dashboard/expense-details")}
        />

        {/* Remaining Income Spin Wheel */}
        <IncomeWheel remaining={remaining} total={income} />

        {/* Expense Pie Chart */}
        <ExpensePieChart income={income} expense={expense} />

        {/* Toggle Add Income / Expense */}
        <IncomeExpenseToggle />

        {/* AI Insight */}
        <AIInsightCard />

        {/* Weekly Trend */}
        <WeeklyTrendCard />

        {/* Monthly Analytics */}
        <MonthlyAnalyticsChart />

        {/* Savings Goal */}
        <SavingsGoalCard />

        {/* Category Analytics */}
        <CategoryAnalyticsChart />

        {/* Timeline */}
        <TransactionTimeline />
      </motion.div>
    </>
  );
}
