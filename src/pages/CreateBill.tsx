/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from "react";
import api from "../api";
import "../styles/CreateBill.css";
import { computeAnalytics } from "../utils/billAnalytics";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { getStores, addStore } from "../api/stores";
import { getCategories, addCategory } from "../api/catagories";
import PageWrapper from "../components/layouts/PageWrapper";
import { useBalance } from "../auth/BalanceContext";

interface Item {
  name: string;
  qty: number;
  price: number;
  amount: number;
}

export default function CreateBill() {
  const today = new Date().toISOString().split("T")[0];

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [billDate, setBillDate] = useState(today);

  /* ================= STORES ================= */

  const DEFAULT_STORES = [
    "Nellai Anbu Supermarket",
    "Sri Vinayaga Supermarket",
    "Bargain Mart",
    "Red Berry Snacks",
  ];

  const [storeOptions, setStoreOptions] = useState<string[]>([]);
  const [storeOption, setStoreOption] = useState("");
  const [customStoreName, setCustomStoreName] = useState("");
  const { updateBalance, refreshBalance } = useBalance();

  useEffect(() => {
    getStores()
      .then((stores) =>
        setStoreOptions(stores.length ? stores : DEFAULT_STORES),
      )
      .catch(() => setStoreOptions(DEFAULT_STORES));
  }, []);

  const finalStoreName =
    storeOption === "Other" ? customStoreName.trim() : storeOption;

  const addCustomStore = async () => {
    const name = customStoreName.trim();
    if (!name) return;

    if (storeOptions.includes(name)) {
      setStoreOption(name);
      setCustomStoreName("");
      return;
    }

    try {
      await addStore(name);
      setStoreOptions((prev) => [...prev, name]);
      setStoreOption(name);
      setCustomStoreName("");
      toast.success(`🏪 Store "${name}" added`);
    } catch {
      toast.error("Failed to save store");
    }
  };

  /* ================= CATEGORIES ================= */

  const DEFAULT_CATEGORIES = ["GROCERY", "GENERAL"];

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    getCategories()
      .then((cats: string[]) =>
        setCategoryOptions(cats.length ? cats : DEFAULT_CATEGORIES),
      )
      .catch(() => setCategoryOptions(DEFAULT_CATEGORIES));
  }, []);

  const finalCategory = category === "Other" ? customCategory.trim() : category;

  const addCustomCategory = async () => {
    const name = customCategory.trim().toUpperCase();
    if (!name) return;

    if (categoryOptions.includes(name)) {
      setCategory(name);
      setCustomCategory("");
      return;
    }

    try {
      await addCategory(name);
      setCategoryOptions((prev) => [...prev, name]);
      setCategory(name);
      setCustomCategory("");
      toast.success(`🏷️ Category "${name}" added`);
    } catch {
      toast.error("Failed to save category");
    }
  };

  /* ================= DESCRIPTION ================= */

  const [description, setDescription] = useState("");

  /* ================= ITEMS ================= */

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0, amount: 0 }]);
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const updated = [...items];

    if (field === "qty" || field === "price") {
      updated[index][field] = Number(value);
      updated[index].amount = updated[index].qty * updated[index].price;
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

  /* ================= DATE ================= */

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
    if (!finalStoreName || !finalCategory || items.length === 0) {
      toast.error("Fill all required fields");
      return;
    }

    const payload = {
      storeName: finalStoreName,
      category: finalCategory,
      description,
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
      discountAmount: 0,
      taxAmount: 0,
      source: "MANUAL",
      billDate: buildDateTime(billDate),
      createdAt: buildDateTime(billDate),
    };

    try {
      setLoading(true);
      const res = await api.post("/bills/create", payload);

      if (res.status === 200) {
        updateBalance((prev: number) => prev - Number(payload.totalAmount));
        await refreshBalance();
      }
      
      toast.success(
        `🧾 Bill saved for ${finalStoreName} (₹${totalAmount.toFixed(2)})`,
      );

      setItems([]);
      setStoreOption("");
      setCustomStoreName("");
      setCategory("");
      setCustomCategory("");
      setDescription("");
      setBillDate(today);
    } catch {
      toast.error("Bill creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ANALYTICS ================= */

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
    <PageWrapper>
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
              style={{ marginBottom: 20 }}
            >
              <option value="">Select Store</option>
              {storeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
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
                <button
                  type="submit"
                  onClick={addCustomStore}
                  className="button"
                >
                  ➕ Add
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
              {" "}
              🕒{" "}
              {new Date(buildDateTime(billDate)).toLocaleString("en-IN")}{" "}
            </p>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ marginBottom: 20 }}
            >
              <option value="">Select Type</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

            {category === "Other" && (
              <div className="other-store">
                <input
                  placeholder="Enter category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addCustomCategory}
                  className="button"
                >
                  ➕ Add
                </button>
              </div>
            )}

            {/* Description */}
            {/* <textarea
            placeholder="Bill description (optional)"
            value={description}
            rows={6}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              ...textAreaInputStyle,
              resize: "vertical",
              lineHeight: 1.5
            }}
          /> */}

            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <label
                style={{ fontWeight: 600, marginBottom: 6, display: "block" }}
              >
                Bill Text
              </label>

              <textarea
                rows={6}
                placeholder="Paste bill content here…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  ...textAreaInputStyle,
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />

              <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                You can paste OCR output or manually typed bill data.
              </p>
            </div>

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
                    onClick={() => removeItem(i)}
                    className="remove"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addItem} className="add">
              ➕ Add Item
            </button>

            <div className="total">
              Total: <span>₹ {totalAmount.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className={`submit ${loading ? "loading" : ""}`}
              disabled={!finalStoreName || (items.length === 0 && !loading)}
              onClick={submitBill}
            >
              {" "}
              {loading ? "Saving..." : "Save Bill"}
            </button>
          </form>
        </div>

        {analytics && (
          <div className="analytics-preview">
            <p>🧾 Items: {analytics.totalItems}</p>
            <p>📦 Qty: {analytics.totalQty}</p>
            <p>💰 Avg Rate: ₹ {analytics.avgRate}</p>
          </div>
        )}
      </>
    </PageWrapper>
  );
}

const textAreaInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--card-bg)",
  color: "var(--text)",
  fontSize: 14,
  outline: "none",
};
