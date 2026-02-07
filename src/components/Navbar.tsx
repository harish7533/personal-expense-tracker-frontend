import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 Do not render navbar if not logged in
  if (!token) return null;

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <nav style={styles.nav}>
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        🧾 Bill Analyzer
      </h3>

      <div style={styles.links}>
        {role === "USER" && (
          <>
            <Link to="/upload" style={styles.link}>Upload Bill</Link>
            <Link to="/create" style={styles.link}>Create Bill</Link>
          </>
        )}

        {role === "ADMIN" && (
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        )}

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      <button onClick={toggleTheme} style={styles.themeBtn}>
        {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    background: "linear-gradient(90deg, #1f2933, #111827)",
    color: "#fff",
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },

  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    padding: "6px 10px",
    borderRadius: "8px",
  },

  logout: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },

  themeBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
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
