import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Settings() {
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>⚙️ Settings</h2>

        <div className="card" style={styles.card}>
          <h4>Account</h4>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> Active
          </p>
        </div>

        <div className="card" style={styles.card}>
          <h4>Security</h4>
          <p>JWT verified on server</p>
          <p>Session valid</p>
        </div>

        <div className="card" style={styles.card}>
          <h4>Preferences</h4>
          <p>Theme managed globally</p>
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
  },
};
