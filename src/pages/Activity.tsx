import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/layouts/PageWrapper";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivitiesContext";
import ActivitySkeleton from "../components/skeletons/ActivitySkeleton";
import "../styles/Activity.css";

export default function Activity() {
  const { user, loading: authLoading } = useAuth();
  const {
    activities,
    removeActivity,
    loading: activitiesLoading,
  } = useActivities();
  const lastToastId = useRef<string | null>(null);

  /* ================= TOAST REAL-TIME ================= */
  useEffect(() => {
    if (!user || activities.length === 0) return;

    const latest = activities[0];

    // Show toast for latest activity
    if (latest.id !== lastToastId.current) {
      lastToastId.current = latest.id;
    }
  }, [activities, user]);

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: 40, color: "var(--text)" }}>
        Please log in to view activities.
      </p>
    );

  return (
    <PageWrapper>
      <Navbar />
      {authLoading || activitiesLoading ? (
        <ActivitySkeleton />
      ) : (
        <>
          <div style={styles.container}>
            <h4 style={styles.heading}>🔔 Activity</h4>

            {activities.length === 0 ? (
              <p style={styles.empty}>No activities yet 📝</p>
            ) : (
              <div style={styles.notificationsWrapper}>
                {activities.slice(0, 20).map((a) => (
                  <div
                    key={a.id}
                    style={{
                      ...styles.notification,
                      ...(a.type === "CREDIT" ? styles.credit : styles.debit),
                      // bottom: 20 + index * 120, // stack notifications
                    }}
                  >
                    <span style={styles.cardMessage}>{a.message}</span>
                    <small>
                      {a.balance_before} → {a.balance_after}
                    </small>
                    <small style={{ opacity: 0.6 }}>
                      {new Date(a.created_at).toLocaleString()}
                    </small>
                    <button
                      style={styles.closeBtn}
                      onClick={() => removeActivity(a.id)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </PageWrapper>
  );
}

/* ===================== STYLES ===================== */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    maxWidth: 800,
    margin: "auto",
    fontFamily: "'Inter', sans-serif",
    color: "var(--text)",
    position: "relative",
    minHeight: "80vh",
  },

  heading: { marginBottom: 16 },

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

  notificationsWrapper: {
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: "flex-end",
    zIndex: 9999,
    gap: 12,
  },

  notification: {
    minWidth: 260,
    maxWidth: "80vw",
    background: "var(--card-bg)",
    color: "var(--text)",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    opacity: 0,
    transform: "translateY(20px)",
    animation: "slideUp 0.4s forwards",
    transition: "all 0.3s ease-in-out",
    marginTop: 20,
  },

  cardMessage: { fontSize: 15 },

  credit: { borderLeft: "4px solid #22c55e" },
  debit: { borderLeft: "4px solid #ef4444" },

  closeBtn: {
    position: "absolute",
    top: 7,
    right: 10,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    color: "var(--text-secondary)",
  },
};
