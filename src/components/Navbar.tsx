/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { useEffect, useRef, useState } from "react";
import { markAllAsRead } from "../api/activity";
import { useAuth } from "../auth/AuthContext";
import { useActivities } from "../auth/ActivitiesContext";

export default function Navbar() {
  const { activities, refreshActivities } = useActivities();
  const unreadCount = activities?.length || 0;

  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(unreadCount);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ================= ACCENT ================= */
  useEffect(() => {
    const role = localStorage.getItem("role");
    const accent =
      role === "ADMIN" ? "admin" : role === "USER" ? "user" : "default";

    document.documentElement.setAttribute("data-accent", accent);
  }, []);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  useEffect(() => {
    if (open && unreadCount > 0) {
      markAllAsRead()
        .then(() => {
          refreshActivities(); // from useActivities
        })
        .catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (animatedCount !== unreadCount) {
      const interval = setInterval(() => {
        setAnimatedCount((prev) => {
          if (prev < unreadCount) return prev + 1;
          if (prev > unreadCount) return prev - 1;
          clearInterval(interval);
          return prev;
        });
      }, 40);

      return () => clearInterval(interval);
    }
  }, [unreadCount]);

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
          </>
        )}

        {/* ================= PROFILE DROPDOWN ================= */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            style={styles.profileBtn}
          >
            {user ? getInitials(user.username) : theme === "dark" ? "🌞" : "🌙"}

            {/* Notification Dot */}
            {user && unreadCount > 0 && (
              <span style={styles.notificationBadge}>
                {/* {unreadCount > 9 ? "9+" : unreadCount} */}
                {animatedCount > 9 ? "9+" : animatedCount}
              </span>
            )}
          </button>

          {open && (
            <div style={styles.dropdown}>
              {user ? (
                <>
                  <div style={styles.dropdownHeader}>
                    <strong>{user.username}</strong>
                    <small style={{ opacity: 0.6 }}>{user.email}</small>
                  </div>

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate("/settings");
                      setOpen(false);
                    }}
                  >
                    ⚙ Settings
                  </button>

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate("/activity");
                      setOpen(false);
                    }}
                  >
                    🔔 Notifications
                  </button>

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      toggleTheme();
                      setOpen(false);
                    }}
                  >
                    {theme === "dark"
                      ? "🌞 Switch to Light"
                      : "🌙 Switch to Dark"}
                  </button>

                  <hr style={{ borderColor: "var(--border)" }} />

                  <button
                    style={{
                      ...styles.dropdownItem,
                      color: "var(--error-text)",
                    }}
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <button
                  style={styles.dropdownItem}
                  onClick={() => {
                    toggleTheme();
                    setOpen(false);
                  }}
                >
                  {theme === "dark"
                    ? "🌞 Switch to Light"
                    : "🌙 Switch to Dark"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ===================== STYLES ===================== */

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

  profileBtn: {
    position: "relative",
    background: "var(--accent)",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // dropdown: {
  //   position: "absolute",
  //   top: 52,
  //   right: 0,
  //   background: "var(--card-bg)",
  //   border: "1px solid var(--border)",
  //   borderRadius: 12,
  //   width: 220,
  //   boxShadow: "var(--shadow)",
  //   padding: 12,
  //   display: "flex",
  //   flexDirection: "column",
  //   gap: 8,
  //   animation: "dropdownIn 0.18s ease-out",
  //   transformOrigin: "top right",
  // },

  dropdown: {
    position: "absolute",
    top: 56,
    right: 0,
    width: 240,
    padding: 16,
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,

    /* 🔥 Glass Effect */
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

    animation: "dropdownIn 0.2s ease-out",
    transformOrigin: "top right",
  },

  dropdownHeader: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 8,
  },

  dropdownItem: {
    background: "transparent",
    border: "none",
    padding: "8px 10px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: 14,
  },

  // notificationDot: {
  //   position: "absolute",
  //   top: 6,
  //   right: 6,
  //   width: 8,
  //   height: 8,
  //   background: "#ef4444",
  //   borderRadius: "50%",
  // },

  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    padding: "0 5px",
    background: "#ef4444",
    color: "#fff",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid var(--card-bg)",
    animation: "pulseBadge 1.5s infinite",
  },
};

// import { Link, useNavigate } from "react-router-dom";
// import useDarkMode from "../hooks/useDarkMode";
// import { useEffect } from "react";
// import { useAuth } from "../auth/AuthContext";
// // import api from "../api";
// // import { useBanner } from "../hooks/useBanner";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useDarkMode();
//   const { user, logout } = useAuth();
//   // const { show } = useBanner();

//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     const accent =
//       role === "ADMIN" ? "admin" : role === "USER" ? "user" : "default";

//     document.documentElement.setAttribute("data-accent", accent);
//   }, []);

//   return (
//     <nav style={styles.nav}>
//       <h3
//         style={{ cursor: "pointer", ...styles.logo }}
//         onClick={() => navigate("/dashboard")}
//       >
//         🧾 Expense Tracker
//       </h3>

//       <div style={styles.links}>
//         {user && (
//           <>
//             <Link to="/upload" style={styles.link}>
//               Upload Bill
//             </Link>
//             <Link to="/create" style={styles.link}>
//               Create Bill
//             </Link>
//             <Link to="/dashboard" style={styles.link}>
//               Dashboard
//             </Link>
//             <Link to="/settings" style={styles.link}>
//               Settings
//             </Link>
//             <Link to="/activity" style={styles.link}>
//               Activity
//             </Link>
//           </>
//         )}
//         {user ? (
//           <button onClick={logout} style={styles.logout}>
//             Logout
//           </button>
//         ) : (
//           <div style={styles.links}>
//             <Link to="/login" style={styles.link}>
//               Login
//             </Link>
//           </div>
//         )}
//       </div>

//       <button onClick={toggleTheme} style={styles.themeBtn}>
//         {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
//       </button>
//     </nav>
//   );
// }

// const styles: Record<string, React.CSSProperties> = {
//   nav: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 64,
//     padding: "0 24px",
//     background: "var(--card-bg)",
//     borderBottom: "1px solid var(--border)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     zIndex: 1000,
//     transition: "var(--theme-transition)",
//   },

//   logo: {
//     color: "var(--text)",
//     fontWeight: 700,
//   },

//   links: {
//     display: "flex",
//     gap: 18,
//     alignItems: "center",
//   },

//   link: {
//     color: "var(--text)",
//     textDecoration: "none",
//     fontSize: 14,
//     fontWeight: 500,
//     padding: "6px 10px",
//     borderRadius: 8,
//   },

//   logout: {
//     background: "var(--error-text)",
//     border: "none",
//     color: "#fff",
//     padding: "6px 12px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontWeight: 500,
//   },

//   themeBtn: {
//     background: "var(--input-bg)",
//     border: "1px solid var(--border)",
//     color: "var(--text)",
//     padding: "6px 12px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontWeight: 500,
//   },
// };

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
