/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../api";
import { useBalance } from "../auth/BalanceContext";
import "../styles/Bills.css";

export default function Bills() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    category: "",
    store: "",
    min: "",
    max: "",
  });

  const { updateBalance } = useBalance();

  /* ================= FETCH ================= */
  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bills/all", { params: filters });
      setBills(res.data);
    } catch (err) {
      console.error("Failed to fetch bills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id: string, amount: number) => {
    if (!confirm("Are you sure you want to delete this bill?")) return;

    // optimistic remove
    const previous = bills;
    setBills((prev) => prev.filter((b) => b.id !== id));

    try {
      await api.delete(`/bills/${id}`);

      // 🔥 reflect balance instantly
      updateBalance((prev: number) => prev + amount);
    } catch (err) {
      setBills(previous);
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bills-container">
      <h2 className="bills-title">🧾 My Bills</h2>

      {/* ================= FILTER SECTION ================= */}
      <div className="filter-card">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
        <input
          placeholder="Category"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        />
        <input
          placeholder="Store"
          value={filters.store}
          onChange={(e) => setFilters({ ...filters, store: e.target.value })}
        />
        <input
          placeholder="Min Amount"
          type="number"
          value={filters.min}
          onChange={(e) => setFilters({ ...filters, min: e.target.value })}
        />
        <input
          placeholder="Max Amount"
          type="number"
          value={filters.max}
          onChange={(e) => setFilters({ ...filters, max: e.target.value })}
        />

        <button onClick={fetchBills} className="filter-btn">
          Apply
        </button>
      </div>

      {/* ================= BILL CARDS ================= */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : bills.length === 0 ? (
        <p className="empty">No bills found</p>
      ) : (
        <div className="bill-grid">
          {bills.map((b) => (
            <div key={b.id} className="bill-card">
              <div className="bill-header">
                <h3>{b.storeName}</h3>
                <span className="amount">₹{b.totalAmount}</span>
              </div>

              <p>Bill No: {b.billNo}</p>
              <p>Date: {b.billDate}</p>
              <p>Category: {b.category}</p>

              <button
                className="delete-btn"
                onClick={() => handleDelete(b.id, b.totalAmount)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
