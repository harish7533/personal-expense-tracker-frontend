import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import useActivities from "../hooks/useActivities";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import ActivitySkeleton from "../components/skeletons/ActivitySkeleton";

type Activity = {
  id: string;
  type: string;
  message: string;
  created_at: string;
};

export default function Activity() {
  const { user, loading } = useAuth();
  const { activities, removeActivity } = useActivities();
  const lastToastId = useRef<string | null>(null);

  /* ================= TOAST REAL-TIME ================= */
  useEffect(() => {
    if (!user || activities.length === 0) return;

    const latest = activities[0];

    // Prevent duplicate toasts
    if (latest.id !== lastToastId.current) {
      toast(latest.message, {
        icon: latest.type === "USER" ? "🧾" : "⚡",
        id: latest.id,
      });

      lastToastId.current = latest.id;
    }
  }, [activities, user]);

  /* ================= UI STATES ================= */
  if (loading) return <ActivitySkeleton />;

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        Please log in to view activities.
      </p>
    );

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h4>🔔 Activity</h4>

        {activities.length === 0 ? (
          <p style={styles.empty}>No activities yet 📝</p>
        ) : (
          activities.map((a) => (
            <div key={a.id} style={styles.card}>
              <span>{a.message}</span>
              <small style={{ opacity: 0.6 }}>
                {new Date(a.created_at).toLocaleString()}
              </small>
              <button
                onClick={() => removeActivity(a.id)}
                style={styles.closeBtn}
              >
                ✖
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

/* ===================== STYLES ===================== */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    maxWidth: 800,
    margin: "auto",
    fontFamily: "'Inter', sans-serif",
    color: "var(--text-primary)",
  },

  empty: {
    marginTop: 60,
    padding: 40,
    textAlign: "center",
    background: "var(--card-bg)",
    borderRadius: 12,
    boxShadow: "var(--shadow)",
    color: "var(--muted)",
    opacity: 0.8,
  },
  card: {
    background: "var(--card-bg)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    animation: "fadeIn 0.4s ease",
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
    color: "var(--text-secondary)",
  },
};
