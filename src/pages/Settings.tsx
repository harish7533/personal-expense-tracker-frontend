/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

type User = {
  id: string;
  role?: string;
  username?: string;
};

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState("Light");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));

    // read theme from localStorage (or your theme context)
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme === "dark" ? "Dark 🌙" : "Light ☀️");
    }
  }, []);

  if (!user) return null;

  const isActive = Boolean(user.role);

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>⚙️ Settings</h2>

        {/* ACCOUNT */}
        <div className="card" style={styles.card}>
          <h4>👤 Account</h4>

          <p>
            <strong>Username:</strong>{" "}
            {user.username ?? "Not assigned"}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user.role ?? "—"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {isActive ? "🟢 Active" : "🔴 Inactive"}
          </p>
        </div>

        {/* SECURITY */}
        <div className="card" style={styles.card}>
          <h4>🔐 Security</h4>
          <p>✅ JWT verified on server</p>
          <p>✅ Session valid</p>
        </div>

        {/* PREFERENCES */}
        <div className="card" style={styles.card}>
          <h4>🎨 Preferences</h4>
          <p>
            <strong>Current Theme:</strong> {theme}
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: 24,
    maxWidth: 800,
    margin: "auto",
  },
  card: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
};
