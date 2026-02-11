import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import "../styles/UploadBills.css";
import toast from "react-hot-toast";
import PageWrapper from "../components/layouts/PageWrapper";
import { useBalance } from "../auth/BalanceContext";

export default function UploadBills() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [billDate, setBillDate] = useState(today);
  const { updateBalance, refreshBalance } = useBalance();

  const buildDateTime = (dateStr: string) => {
    const selected = new Date(dateStr);

    const now = new Date();
    selected.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );

    return selected.toISOString(); // backend-safe
  };

  const uploadBill = async () => {
    if (!file) {
      setShowToast({ type: "error", msg: "Please select a bill image" });
      toast.error("Please select a bill image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("billDate", buildDateTime(billDate)); // ✅ FIX

    try {
      setLoading(true);
      setShowToast(null);

      const res = await api.post("/bills/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        updateBalance((prev) => prev - Number(res.data.totalAmount));
        await refreshBalance();
      }

      setShowToast({ type: "success", msg: "Bill uploaded successfully" });
      toast.success("Bill uploaded successfully");
      setFile(null);
    } catch (err) {
      setShowToast({
        type: "error",
        msg: "Upload failed. " + ((err as Error)?.message || String(err)),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <>
        <Navbar />

        <div className="upload-page">
          <div className="upload-card">
            <h1>Upload Bill</h1>

            <p className="subtitle">
              Upload a bill image to auto-extract items & analytics 📸
            </p>

            <label className="file-input">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <span>{file ? file.name : "Choose bill image"}</span>
            </label>

            <input
              type="date"
              value={billDate}
              style={{ marginBottom: 20 }}
              onChange={(e) => setBillDate(e.target.value)}
            />

            <p className="date-preview">
              🕒{" "}
              {new Date(buildDateTime(billDate)).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            <button
              type="button"
              className={`submit ${loading ? "loading" : ""}`}
              disabled={!file || loading}
              onClick={uploadBill}
            >
              {loading ? "Uploading..." : "Upload Bill"}
            </button>

            <small className="note">
              Uploaded bills are securely stored and appear in analytics
              instantly.
            </small>

            {showToast && (
              <div className={`showToast ${showToast.type}`}>
                {showToast.type === "success" ? "✅" : "❌"} {showToast.msg}
              </div>
            )}
          </div>
        </div>
      </>
    </PageWrapper>
  );
}
