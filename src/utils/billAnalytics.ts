export function computeAnalytics(items: {
  qty: number;
  rate: number;
  amount: number;
}[]) {
  if (!items.length) return undefined;

  const totalQty = items.reduce((s, i) => s + (i.qty || 0), 0);
  const totalSpend = items.reduce((s, i) => s + i.amount, 0);

  return {
    totalItems: items.length,
    totalQty,
    avgRate: Number((totalSpend / totalQty).toFixed(2)),
  };
}
