/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api";

type Activity = {
  id: string;
  message: string;
  created_at: string;
};

export default function Activity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = async () => {
    const res = await api.get("/activities");
    setActivities(res.data);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const removeActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  if (!activities.length) return null;

  return (
    <div style={styles.wrapper}>
      <h4>🔔 Activity</h4>

      {activities.map((a) => (
        <div key={a.id} style={styles.card}>
          <span>{a.message}</span>

          <button onClick={() => removeActivity(a.id)} style={styles.close}>
            ✖
          </button>
        </div>
      ))}
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px",
    color: "var(--text)",
  },

  empty: {
    marginTop: 60,
    padding: 40,
    textAlign: "center",
    background: "var(--card-bg)",
    borderRadius: 12,
    boxShadow: "var(--shadow)",
    color: "var(--muted)",
  },

  list: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  time: {
    fontSize: 12,
    color: "var(--muted)",
  },

  message: {
    marginTop: 6,
    color: "var(--text)",
    lineHeight: 1.5,
  },
   wrapper: {
    padding: 16,
    maxWidth: 400,
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
  close: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
  },
};
