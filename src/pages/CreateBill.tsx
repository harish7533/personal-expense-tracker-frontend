import { useState, useMemo } from "react";
import api from "../api";
import "../styles/CreateBill.css";
import { computeAnalytics } from "../utils/billAnalytics";
import Navbar from "../components/Navbar";

interface Item {
  name: string;
  qty: number;
  price: number;
  amount: number;
}

export default function CreateBill() {
  const today = new Date().toISOString().split("T")[0];

  const [category, setCategory] = useState("GROCERY");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [billDate, setBillDate] = useState(today);

  /* ================= STORE (DYNAMIC + PERSISTENT) ================= */

  const [storeOptions, setStoreOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem("customStores");
    return saved
      ? JSON.parse(saved)
      : [
          "Nellai Anbu Supermarket",
          "Sri Vinayaga Supermarket",
          "Bargain Mart",
          "Red Berry Snacks",
        ];
  });

  const [storeOption, setStoreOption] = useState("");
  const [customStoreName, setCustomStoreName] = useState("");

  const finalStoreName =
    storeOption === "Other" ? customStoreName.trim() : storeOption;

  const addCustomStore = () => {
    if (!customStoreName.trim()) return;

    const updated = [...storeOptions, customStoreName.trim()];
    setStoreOptions(updated);
    localStorage.setItem("customStores", JSON.stringify(updated));

    setStoreOption(customStoreName.trim());
    setCustomStoreName("");
  };

  /* ================= ITEMS ================= */

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0, amount: 0 }]);
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const updated = [...items];

    if (field === "qty" || field === "price") {
      updated[index][field] = Number(value);
      updated[index].amount =
        updated[index].qty * updated[index].price;
    } else {
      updated[index].name = value;
    }

    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /* ================= TOTAL ================= */

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + (i.amount || 0), 0),
    [items],
  );

  /* ================= DATE + TIME ================= */

  const buildDateTime = (dateStr: string) => {
    const selected = new Date(dateStr);
    const now = new Date();

    selected.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );

    return selected.toISOString();
  };

  /* ================= SUBMIT ================= */

  const submitBill = async () => {
    if (!finalStoreName || items.length === 0) return;

    const payload = {
      storeName: finalStoreName,
      category,
      totalAmount,
      grossAmount: totalAmount,
      currency: "INR",
      groceries: items.map((i) => ({
        description: i.name,
        qty: i.qty,
        rate: i.price,
        amount: i.amount,
        mrp: null,
        hsnc: null,
        verified: true,
      })),
      source: "MANUAL",
      billDate: buildDateTime(billDate),
      createdAt: buildDateTime(billDate),
    };

    try {
      setLoading(true);

      // await fetch("/api/bills/create", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      await api.post("/bills/create", payload);

      setShowToast(true);
      setItems([]);
      setStoreOption("");
      setCustomStoreName("");
      setBillDate(today);

      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to create bill", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ANALYTICS (STABLE) ================= */

  const analytics =
    items.length > 0
      ? computeAnalytics(
          items.map((i) => ({
            qty: i.qty,
            rate: i.price,
            amount: i.amount,
          })),
        )
      : null;

  /* ================= UI ================= */

  return (
    <>
      <Navbar />

      <div className="bill-page">
        <form className="bill-card" onSubmit={(e) => e.preventDefault()}>
          <h1>Create Bill</h1>
          <p className="subtitle">Manually add your bill details</p>

          {/* Store */}
          <select
            value={storeOption}
            onChange={(e) => {
              setStoreOption(e.target.value);
              if (e.target.value !== "Other") setCustomStoreName("");
            }}
          >
            <option value="">Select Store</option>
            {storeOptions.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {storeOption === "Other" && (
            <div className="other-store">
              <input
                placeholder="Enter store name"
                value={customStoreName}
                onChange={(e) => setCustomStoreName(e.target.value)}
              />
              <button type="button" onClick={addCustomStore}>
                Add
              </button>
            </div>
          )}

          {/* Date */}
          <input
            type="date"
            max={today}
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
          />

          <p className="date-preview">
            🕒{" "}
            {new Date(buildDateTime(billDate)).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>

          {/* Category */}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="GROCERY">Grocery</option>
            <option value="GENERAL">General</option>
          </select>

          {/* Items */}
          <div className="items">
            {items.map((item, i) => (
              <div className="item-row" key={i}>
                <input
                  placeholder="Item"
                  value={item.name}
                  onChange={(e) => updateItem(i, "name", e.target.value)}
                />
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(i, "qty", e.target.value)}
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(i, "price", e.target.value)}
                />
                <input type="number" value={item.amount} disabled />
                <button
                  type="button"
                  className="remove"
                  onClick={() => removeItem(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add" onClick={addItem}>
            ➕ Add Item
          </button>

          <div className="total">
            Total: <span>₹ {totalAmount.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className={`submit ${loading ? "loading" : ""}`}
            disabled={!finalStoreName || items.length === 0}
            onClick={submitBill}
          >
            {loading ? "Saving..." : "Save Bill"}
          </button>

          {showToast && <div className="toast">✅ Bill saved</div>}
        </form>

        {analytics && (
          <div className="analytics-preview">
            <p>🧾 Items: {analytics.totalItems}</p>
            <p>📦 Qty: {analytics.totalQty}</p>
            <p>💰 Avg Rate: ₹ {analytics.avgRate}</p>
          </div>
        )}
      </div>
    </>
  );
}
