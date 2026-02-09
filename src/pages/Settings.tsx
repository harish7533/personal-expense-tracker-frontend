import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import SettingsSkeleton from "../components/skeletons/SettingsSkeleton";
import PageWrapper from "../components/layouts/PageWrapper";

export default function Settings() {
  const { user, loading } = useAuth();
  const [theme] = useState("light");
  console.log("user from Settings:", user);
  console.log("username from Settings:", user?.username);

  return (
    <PageWrapper>
      {loading ? (
        <SettingsSkeleton />
      ) : (
        <>
          <Navbar />

          <div style={styles.container}>
            <h2>⚙️ Settings</h2>

            {/* Account */}
            <div style={styles.card}>
              <h4>Account</h4>
              <p>
                <strong>Username:</strong> {user?.username || "—"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {user?.role ? "🟢 Active" : "⚪ Inactive"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
            </div>

            {/* Security */}
            <div style={styles.card}>
              <h4>Security</h4>
              <p>🔑 JWT verified on server</p>
              <p>🕒 Session valid</p>
            </div>

            {/* Preferences */}
            <div style={styles.card}>
              <h4>Preferences</h4>
              <p>🎨 Theme: {theme}</p>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
    maxWidth: 800,
    margin: "auto",
    fontFamily: "'Inter', sans-serif",
    color: "var(--text-primary)",
  },
  card: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    background: "var(--card-bg)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};
