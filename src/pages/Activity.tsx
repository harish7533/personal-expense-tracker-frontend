import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import ActivitySkeleton from "../components/skeletons/ActivitySkeleton";
import PageWrapper from "../components/layouts/PageWrapper";
import { useActivities } from "../context/ActivitiesContext";

type Activity = {
  id: string;
  type: string;
  message: string;
  created_at: string;
};

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

    // Prevent duplicate toasts
    if (latest.id !== lastToastId.current) {
      // toast(latest.message, {
      //   icon: latest.type === "USER" ? "🧾" : "⚡",
      //   id: latest.id,
      // });

      toast(latest.message, {
        icon: latest.type === "DEBIT" ? "💸" : "💰",
        id: latest.id,
      });

      lastToastId.current = latest.id;
    }
  }, [activities, user]);

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        Please log in to view activities.
      </p>
    );

  return (
    <PageWrapper>
      {authLoading || activitiesLoading ? (
        <ActivitySkeleton />
      ) : (
        <>
          <Navbar />
          <div style={styles.container}>
            <h4>🔔 Activity</h4>

            {activities.length === 0 ? (
              <p style={styles.empty}>No activities yet 📝</p>
            ) : (
              activities.map((a) => (
                <div
                  key={a.id}
                  className={`card ${a.type === "CREDIT" ? "credit" : "debit"}`}
                >
                  <span>{a.message}</span>
                  <small>
                    {a.balance_before} → {a.balance_after}
                  </small>
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
      )}
    </PageWrapper>
  );
}

// type Props = {
//   value: number;
// };

// export default function AnimatedBalance({ value }: Props) {
//   const [display, setDisplay] = useState(value);
//   const prev = useRef(value);

//   useEffect(() => {
//     const start = prev.current;
//     const end = value;
//     const diff = end - start;
//     const duration = 500;
//     const startTime = performance.now();

//     const animate = (now: number) => {
//       const progress = Math.min((now - startTime) / duration, 1);
//       setDisplay(Math.round(start + diff * progress));

//       if (progress < 1) requestAnimationFrame(animate);
//       else prev.current = value;
//     };

//     requestAnimationFrame(animate);
//   }, [value]);

//   const isIncrease = value > prev.current;

//   return (
//     <span
//       style={{
//         fontWeight: 600,
//         color: isIncrease ? "#22c55e" : "#ef4444",
//         transition: "color 0.3s",
//       }}
//     >
//       ₹{display.toLocaleString()}
//     </span>
//   );
// }

/* ===================== STYLES ===================== */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    maxWidth: 800,
    margin: "auto",
    fontFamily: "'Inter', sans-serif",
    color: `var(--text)`,
  },

  empty: {
    marginTop: 60,
    padding: 40,
    textAlign: "center",
    background: `var(--card-bg)`,
    borderRadius: 12,
    boxShadow: `var(--shadow)`,
    color: `var(--muted)`,
    opacity: 0.8,
  },

  card: {
    background: `var(--card-bg)`,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    animation: "fadeIn 0.4s ease",
  },

  credit: {
    background: "#e6fffa",
    color: "#047857",
  },

  debit: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  closeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
    color: `var(--text-secondary)`,
  },
};
