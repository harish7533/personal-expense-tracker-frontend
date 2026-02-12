/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WeeklyTrend {
  incomeChange: number;
  expenseChange: number;
}

export function calculateWeeklyTrend(transactions: any[]): WeeklyTrend {
  const now = new Date();

  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - 7);

  const startOfLastWeek = new Date(now);
  startOfLastWeek.setDate(now.getDate() - 14);

  let thisWeekIncome = 0;
  let lastWeekIncome = 0;
  let thisWeekExpense = 0;
  let lastWeekExpense = 0;

  transactions.forEach(t => {
    const date = new Date(t.created_at);

    if (date > startOfThisWeek) {
      if (t.type === "income") thisWeekIncome += Number(t.amount);
      else thisWeekExpense += Number(t.amount);
    } else if (date > startOfLastWeek) {
      if (t.type === "income") lastWeekIncome += Number(t.amount);
      else lastWeekExpense += Number(t.amount);
    }
  });

  const incomeChange =
    lastWeekIncome === 0
      ? 100
      : ((thisWeekIncome - lastWeekIncome) / lastWeekIncome) * 100;

  const expenseChange =
    lastWeekExpense === 0
      ? 100
      : ((thisWeekExpense - lastWeekExpense) / lastWeekExpense) * 100;

  return { incomeChange, expenseChange };
}
