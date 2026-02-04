export interface RawItemInput {
  description: string;
  qty: number;
  rate: number;
  amount: number;
  mrp?: number | null;
  hsnc?: string | null;
}

interface BuildBillPayloadArgs {
  storeName: string;
  category?: string;
  groceries: RawItemInput[];
  rawText: string;
  source: "UPLOAD" | "MANUAL";
  billDate?: string;
}

export function buildBillPayload({
  storeName,
  category = "GROCERY",
  groceries,
  source,
  rawText = "",
  billDate = "",
}: BuildBillPayloadArgs) {
  const totalAmount = groceries.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0,
  );

  const billDateData = billDate
    ? new Date(billDate)
    : new Date();


  return {
    storeName,
    category,
    totalAmount,
    grossAmount: totalAmount,
    currency: "INR",
    groceries: groceries.map((i) => ({
      description: i.description,
      qty: i.qty,
      rate: i.rate,
      amount: i.amount,
      mrp: i.mrp ?? null,
      hsnc: i.hsnc ?? null,
      verified: true,
    })),
    source,
    rawText,
    createdAt: billDateData,
  };
}
