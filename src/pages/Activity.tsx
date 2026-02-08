/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect } from "react";
import toast from "react-hot-toast";
import useActivities from "../hooks/useActivities";
import Navbar from "../components/Navbar";

type Activity = {
  id: string;
  type: string;
  message: string;
  created_at: string;
};

export default function Activity() {
  // const [loading, setLoading] = useState(true);
  const { activities, removeActivity } = useActivities();
  // const [activities, setActivities] = useState<Activity[]>([]);
  // /* ================= FETCH ACTIVITIES ================= */
  // const fetchActivities = async () => {
  //   try {
  //     const res = await api.get("/activity");
  //     setActivities(res.data);
  //   } catch (err) {
  //     console.error("Failed to fetch activities", err);
  //     toast.error("⚠️ Could not load activities");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // /* ================= ON MOUNT ================= */
  // useEffect(() => {
  //   fetchActivities();

  //   // Optional: Poll every 10s for real-time updates
  //   const interval = setInterval(fetchActivities, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  // /* ================= REMOVE ACTIVITY ================= */
  // const removeActivity = (id: string) => {
  //   setActivities((prev) => prev.filter((a) => a.id !== id));
  // };

  /* ================= TOAST REAL-TIME ================= */
  useEffect(() => {
    // show toast for latest activity
    if (activities.length > 0) {
      const latest = activities[0];
      toast(`${latest.message}`, {
        icon: latest.type === "USER" ? "🧾" : "⚡",
      });
    }
  }, [activities]);

  // if (loading)
  //   return (
  //     <p style={{ textAlign: "center", marginTop: 40 }}>
  //       Loading activities...
  //     </p>
  //   );

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
