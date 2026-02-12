/* eslint-disable @typescript-eslint/no-unused-vars */
export interface InsightResult {
  title: string;
  message: string;
  status: "good" | "warning" | "danger";
}

export function generateInsights(
  income: number,
  expense: number,
  _transactionsCount: number
): InsightResult {

  if (income === 0 && expense === 0) {
    return {
      title: "No Activity Yet",
      message: "Start adding income or expenses to see insights.",
      status: "warning",
    };
  }

  const ratio = income > 0 ? (expense / income) * 100 : 100;

  if (ratio >= 90) {
    return {
      title: "Critical Spending 🚨",
      message: `You've used ${ratio.toFixed(
        1
      )}% of your income. You're close to overspending.`,
      status: "danger",
    };
  }

  if (ratio >= 70) {
    return {
      title: "High Spending ⚠️",
      message: `You’ve spent ${ratio.toFixed(
        1
      )}% of your income. Consider slowing down.`,
      status: "warning",
    };
  }

  if (ratio < 50) {
    return {
      title: "Healthy Savings 💎",
      message: `Great job! You’ve only used ${ratio.toFixed(
        1
      )}% of your income.`,
      status: "good",
    };
  }

  return {
    title: "Balanced Budget 👍",
    message: `You’ve used ${ratio.toFixed(
      1
    )}% of your income. Keep tracking consistently.`,
    status: "good",
  };
}
