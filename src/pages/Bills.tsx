/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../api";

export default function Bills() {
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/bills/admin/all")
      .then((res) => setBills(res.data))
      .catch((err) => console.error("Failed to fetch bills", err));
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
              <td>{b.billDate}</td>
              <td>₹{b.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

