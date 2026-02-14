import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import SettingsSkeleton from "../components/skeletons/SettingsSkeleton";
import PageWrapper from "../components/layouts/PageWrapper";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Settings() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PageWrapper>
      {loading ? (
        <SettingsSkeleton />
      ) : (
        <>
          <Navbar />
          <div style={styles.container}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              style={{ marginBottom: 25 }}
            >
              ⚙️ Settings
            </motion.h2>

            {/* ================= ACCOUNT ================= */}
            <motion.div
              style={styles.card}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.4 }}
            >
              <h4>Account Details</h4>
              <p>
                <strong>Username:</strong> {user?.username || "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {user?.role ? "🟢 Active" : "⚪ Inactive"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
            </motion.div>

            {/* ================= SECURITY ================= */}
            <motion.div
              style={styles.card}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h4>Security</h4>
              <p>🔑 JWT verified on server</p>
              <p>🕒 Session valid</p>
            </motion.div>

            {/* ================= PREFERENCES ================= */}
            <motion.div
              style={styles.card}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h4>Preferences</h4>
              <p>🎨 Theme: {theme}</p>
            </motion.div>

            {/* ================= DESKTOP ROUTES ================= */}
            {!isMobile && (
              <motion.div
                style={styles.card}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h4>📋 Routes</h4>
                <div style={styles.desktopRoutes}>
                  <button
                    style={styles.routeBtn}
                    onClick={() => navigate("/bills")}
                  >
                    Bills
                  </button>
                  <button
                    style={styles.routeBtn}
                    onClick={() => navigate("/create")}
                  >
                    Create Bill
                  </button>
                  <button
                    style={styles.routeBtn}
                    onClick={() => navigate("/upload")}
                  >
                    Upload Bill
                  </button>
                  <button style={styles.routeBtn} onClick={toggleTheme}>
                    Toggle Theme
                  </button>
                  {user && (
                    <button
                      style={{ ...styles.routeBtn, ...styles.logoutBtn }}
                      onClick={logout}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ================= MOBILE ROUTES ================= */}
            {isMobile && (
              <motion.div
                style={styles.card}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4>📱 Quick Actions</h4>
                <div style={styles.mobileRoutes}>
                  <button
                    style={styles.routeBtn}
                    onClick={() => navigate("/create")}
                  >
                    Create Bill
                  </button>
                  <button
                    style={styles.routeBtn}
                    onClick={() => navigate("/upload")}
                  >
                    Upload Bill
                  </button>
                  <button style={styles.routeBtn} onClick={toggleTheme}>
                    Toggle Theme
                  </button>
                  {user && (
                    <button
                      style={{ ...styles.routeBtn, ...styles.logoutBtn }}
                      onClick={logout}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </PageWrapper>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
    maxWidth: "80vw",
    margin: "auto",
    fontFamily: "'Inter', sans-serif",
    color: `var(--text)`,
  },
  card: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 14,
    background: "var(--card-bg)",
    boxShadow: `0 6px 18px var(--background)`,
    color: `var(--text)`,
    cursor: "default",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  themeBtn: {
    marginTop: 10,
    padding: "8px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1, #22c55e)",
    color: "var(--text)",
    fontWeight: 500,
    transition: "transform 0.2s ease",
  },
  desktopRoutes: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  mobileRoutes: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  routeBtn: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "rgb(99, 102, 241)",
    color: "white",
    fontWeight: 600,
    transition: "transform 0.3s ease",
    marginTop: 15,
  },
  logoutBtn: {
    background: "#ef4444",
  },
};
