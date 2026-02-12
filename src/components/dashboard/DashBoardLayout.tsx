import StatCard from "./StatCard";
import IncomeExpenseToggle from "./IncomeExpenseToggle";
import ExpensePieChart from "./ExpensePieChart";
import IncomeWheel from "./IncomeWheel";
import { useFinance } from "../../context/FincanceContext";
import { useNavigate } from "react-router-dom";
import "../../styles/DashBoardLayout.css";

import { motion } from "framer-motion";
import TransactionTimeline from "./TransactionTimeline";
import AIInsightCard from "./AIInsightCard";
import WeeklyTrendCard from "./WeeklyTrendCard";
import MonthlyAnalyticsChart from "./MonthlyAnalyticsChart";
import SavingsGoalCard from "./SavingsGoalCard";
import CategoryAnalyticsChart from "./CategoryAnalyticsChart";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function DashboardLayout() {
  const { income, expense } = useFinance();
  const navigate = useNavigate();

  const remaining = income - expense;

  return (
    <motion.div
      className="dashboard-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <StatCard
        title="Income"
        amount={income}
        type="income"
        onView={() => navigate("/income-details")}
      />

      <StatCard
        title="Expense"
        amount={expense}
        type="expense"
        onView={() => navigate("/expense-details")}
      />

      <IncomeWheel remaining={remaining} total={income} />

      <ExpensePieChart income={income} expense={expense} />

      <IncomeExpenseToggle />

      <AIInsightCard />

      <WeeklyTrendCard />

      <MonthlyAnalyticsChart />

      <SavingsGoalCard />

      <CategoryAnalyticsChart />

      <TransactionTimeline />
    </motion.div>
  );
}
