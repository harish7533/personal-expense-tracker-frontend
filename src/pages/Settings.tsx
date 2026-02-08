/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";// assuming you have a theme context

interface User {
  id: string;
  email: string;
  username?: string;
  role?: string | null;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // fetch current theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);

    // fetch authenticated user
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>⚙️ Settings</h2>

        {/* Account */}
        <div style={styles.card}>
          <h4>Account</h4>
          <p>
            <strong>Username:</strong> {user.username || "—"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {user.role ? "🟢 Active" : "⚪ Inactive"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
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
