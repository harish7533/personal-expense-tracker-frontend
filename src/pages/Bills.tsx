/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

export default function Bills() {
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:4590/api/bills/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBills(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🧾 Bills</h2>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Store</th>
            <th>Bill No</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b, i) => (
            <tr key={i}>
              <td>{b.storeName}</td>
              <td>{b.billNo}</td>
              <td>{b.date}</td>
              <td>₹{b.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
