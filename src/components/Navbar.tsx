import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api";
import { useBanner } from "../hooks/useBanner";

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const { user, loading } = useAuth();
  const { show } = useBanner();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const accent =
      role === "ADMIN" ? "admin" : role === "USER" ? "user" : "default";

    document.documentElement.setAttribute("data-accent", accent);
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      show("logged-out");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (loading) return null;

  return (
    <nav style={styles.nav}>
      <h3
        style={{ cursor: "pointer", ...styles.logo }}
        onClick={() => navigate("/dashboard")}
      >
        🧾 Expense Tracker
      </h3>

      <div style={styles.links}>
        {user && (
          <>
            <Link to="/upload" style={styles.link}>
              Upload Bill
            </Link>
            <Link to="/create" style={styles.link}>
              Create Bill
            </Link>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/settings" style={styles.link}>
              Settings
            </Link>
            <Link to="/activity" style={styles.link}>
              Activity
            </Link>
            <button onClick={logout} style={styles.logout}>
              Logout
            </button>
          </>
        )}
      </div>

      <button onClick={toggleTheme} style={styles.themeBtn}>
        {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    padding: "0 24px",
    background: "var(--card-bg)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000,
    transition: "var(--theme-transition)",
  },

  logo: {
    color: "var(--text)",
    fontWeight: 700,
  },

  links: {
    display: "flex",
    gap: 18,
    alignItems: "center",
  },

  link: {
    color: "var(--text)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    padding: "6px 10px",
    borderRadius: 8,
  },

  logout: {
    background: "var(--error-text)",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },

  themeBtn: {
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
};

// import { Link, useNavigate } from "react-router-dom";
// import useDarkMode  from "../hooks/useDarkMode";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useDarkMode();
//   const role = localStorage.getItem("role");

//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <nav style={styles.nav}>
//       <h3>🧾 Bill Analyzer</h3>

//       <div style={styles.links}>
//         {role === "USER" && (
//           <>
//             <Link to="/upload" style={styles.link}>Upload Bill</Link>
//             <Link to="/create" style={styles.link}>Create Bill</Link>
//           </>
//         )}
//         {role === "ADMIN" && <Link to="/dashboard" style={styles.link}>Dashboard</Link>}
//         <button onClick={logout} style={{ ...styles.link, color: "#000" }}>Logout</button>
//       </div>
//       <button onClick={toggleTheme} style={{ ...styles.link, color: "#000" }}>{theme === "dark" ? "🌞 Light" : "🌙 Dark"}</button>
//     </nav>
//   );
// }

// const styles = {
//   nav: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "14px 24px",
//     background: "linear-gradient(90deg, #1f2933, #111827)",
//     color: "#fff",
//     fontFamily: "'Inter', system-ui, sans-serif",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//   },

//   links: {
//     display: "flex",
//     gap: "18px",
//     alignItems: "center",
//   },

//   link: {
//     color: "#e5e7eb",
//     textDecoration: "none",
//     fontSize: "14px",
//     fontWeight: 500,
//     padding: "6px 10px",
//     borderRadius: "8px",
//     transition: "all 0.25s ease",
//   },

//   linkHover: {
//     background: "rgba(255,255,255,0.08)",
//     color: "#fff",
//   },

//   active: {
//     background: "#2563eb",
//     color: "#fff",
//   },
// };
