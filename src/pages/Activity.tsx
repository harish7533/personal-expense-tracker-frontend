import Navbar from "../components/Navbar";
import useNotifications from "../hooks/useNotifications";

export default function Activity() {
  const userId = localStorage.getItem("userId");
  const notifications = useNotifications(userId);

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>🔔 Activity</h2>

        {notifications.length === 0 ? (
          <div style={styles.empty}>
            <p>No activity yet</p>
            <span>Your notifications will appear here.</span>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((n) => (
              <div key={n.id} style={styles.card}>
                <div style={styles.header}>
                  <strong>{n.title}</strong>
                  <span style={styles.time}>
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                <p style={styles.message}>{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ===================== STYLES ===================== */

const styles : { [key: string]: React.CSSProperties } = {
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

  card: {
    background: "var(--card-bg)",
    padding: 18,
    borderRadius: 12,
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
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
};
