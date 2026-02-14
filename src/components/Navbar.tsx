/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { markAllAsRead } from "../api/activity";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivitiesContext";

import { FiSettings, FiBell, FiLogOut, FiMoon, FiSun } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading } = useAuth();
  const { activities, refreshActivities } = useActivities();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ================= SAFE UNREAD COUNT ================= */
  const unreadCount = activities?.filter((a: any) => !a?.read)?.length ?? 0;

  /* ================= SAFE INITIALS ================= */
  function getInitials(name?: string | null) {
    if (!name || typeof name !== "string") return "U";

    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const initials = getInitials(user?.username);

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

  /* ================= AUTO MARK AS READ ================= */
  useEffect(() => {
    if (open && unreadCount > 0) {
      markAllAsRead()
        .then(() => refreshActivities())
        .catch(() => {});
    }
  }, [open, unreadCount, refreshActivities]);

  /* ================= WAIT FOR AUTH LOAD ================= */
  if (loading) {
    return null; // or return a small loader
  }

  <nav
    className="hidden md:flex fixed top-0 left-0 right-0 z-50 
  items-center justify-between px-6 h-16
  backdrop-blur-xl bg-white/60 dark:bg-black/40
  border-b border-white/20 dark:border-white/10
  shadow-sm"
  >
    {/* Logo */}
    <h3
      className="text-lg font-semibold cursor-pointer text-[var(--text)]"
      onClick={() => navigate("/dashboard")}
    >
      🧾 Expense Tracker
    </h3>

    {/* Right Side */}
    <div className="flex items-center gap-4">
      {/* 🔔 Activity */}
      {user && (
        <div className="relative">
          <button
            onClick={() => navigate("/activity")}
            className="relative p-2 rounded-xl hover:bg-white/30 
          dark:hover:bg-white/10 transition-all duration-200"
          >
            <FiBell size={18} />
          </button>

          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 
            text-[10px] px-1.5 py-0.5 rounded-full
            bg-red-500 text-white font-medium"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      )}

      {/* ⚙️ Settings */}
      {user && (
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-xl hover:bg-white/30 
        dark:hover:bg-white/10 transition-all duration-200"
        >
          <FiSettings size={18} />
        </button>
      )}

      {/* 👤 Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full 
        bg-gradient-to-br from-indigo-500 to-purple-600
        text-white font-semibold text-sm
        flex items-center justify-center
        shadow-md hover:scale-105 transition-all duration-200"
        >
          {user ? initials : theme === "dark" ? "🌞" : "🌙"}
        </button>

        {open && (
          <div
            className="absolute right-0 mt-3 w-52
          backdrop-blur-xl bg-white/80 dark:bg-black/60
          border border-white/20 dark:border-white/10
          shadow-xl rounded-xl p-2"
          >
            {user ? (
              <>
                <div className="px-3 py-2 text-sm border-b border-white/20">
                  <p className="font-semibold">{user?.username || "User"}</p>
                  <p className="text-xs opacity-70">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    toggleTheme();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg
                hover:bg-white/30 dark:hover:bg-white/10 transition"
                >
                  {theme === "dark" ? (
                    <FiSun size={14} />
                  ) : (
                    <FiMoon size={14} />
                  )}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg
                text-red-500 hover:bg-red-500/10 transition"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={toggleTheme}
                className="w-full px-3 py-2 text-sm rounded-lg hover:bg-white/30"
              >
                Toggle Theme
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  </nav>;
}

// import { useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// import { useTheme } from "../context/ThemeContext";
// import { markAllAsRead } from "../api/activity";
// import { useAuth } from "../context/AuthContext";
// import { useActivities } from "../context/ActivitiesContext";

// import { FiSettings, FiBell, FiLogOut, FiMoon, FiSun } from "react-icons/fi";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const { user, logout, loading } = useAuth();
//   const { activities, refreshActivities } = useActivities();

//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   /* ================= SAFE UNREAD COUNT ================= */
//   const unreadCount = activities?.filter((a: any) => !a?.read)?.length ?? 0;

//   /* ================= SAFE INITIALS ================= */
//   function getInitials(name?: string | null) {
//     if (!name || typeof name !== "string") return "U";

//     return name
//       .trim()
//       .split(" ")
//       .filter(Boolean)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   }

//   const initials = getInitials(user?.username);

//   /* ================= CLOSE ON OUTSIDE CLICK ================= */
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ================= AUTO MARK AS READ ================= */
//   useEffect(() => {
//     if (open && unreadCount > 0) {
//       markAllAsRead()
//         .then(() => refreshActivities())
//         .catch(() => {});
//     }
//   }, [open, unreadCount, refreshActivities]);

//   /* ================= WAIT FOR AUTH LOAD ================= */
//   if (loading) {
//     return null; // or return a small loader
//   }

//   return (
//     <nav style={styles.nav}>
//       <h3
//         style={{ cursor: "pointer", color: "var(--text)" }}
//         onClick={() => navigate("/dashboard")}
//       >
//         🧾 Expense Tracker
//       </h3>

//       <div style={styles.links}>
//         {/* ================= ACTIVITY ICON ================= */}
//         {user && (
//           <div style={{ position: "relative" }}>
//             <button
//               style={styles.iconBtn}
//               onClick={() => navigate("/activity")}
//             >
//               <FiBell size={18} />
//             </button>

//             {unreadCount > 0 && (
//               <span style={styles.notificationBadge}>
//                 {unreadCount > 9 ? "9+" : unreadCount}
//               </span>
//             )}
//           </div>
//         )}

//         {/* ================= SETTINGS ICON ================= */}
//         {user && (
//           <button style={styles.iconBtn} onClick={() => navigate("/settings")}>
//             <FiSettings size={18} />
//           </button>
//         )}

//         {/* ================= PROFILE DROPDOWN ================= */}
//         <div style={{ position: "relative" }} ref={dropdownRef}>
//           <button
//             onClick={() => setOpen((prev) => !prev)}
//             style={styles.profileBtn}
//           >
//             {user ? initials : theme === "dark" ? "🌞" : "🌙"}
//           </button>

//           {open && (
//             <div style={styles.dropdown}>
//               {user ? (
//                 <>
//                   <div style={styles.dropdownHeader}>
//                     <strong>{user?.username || "User"}</strong>
//                     <small>{user?.email}</small>
//                   </div>

//                   <button
//                     style={styles.dropdownItem}
//                     onClick={() => {
//                       toggleTheme();
//                       setOpen(false);
//                     }}
//                   >
//                     {theme === "dark" ? (
//                       <>
//                         <FiSun size={16} style={{ marginRight: 8 }} />
//                         Light Mode
//                       </>
//                     ) : (
//                       <>
//                         <FiMoon size={16} style={{ marginRight: 8 }} />
//                         Dark Mode
//                       </>
//                     )}
//                   </button>

//                   <hr />

//                   <button
//                     style={{
//                       ...styles.dropdownItem,
//                       color: "crimson",
//                     }}
//                     onClick={() => {
//                       logout();
//                       navigate("/login");
//                     }}
//                   >
//                     <FiLogOut size={16} style={{ marginRight: 8 }} />
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <button style={styles.dropdownItem} onClick={toggleTheme}>
//                   Toggle Theme
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// /* ===================== STYLES ===================== */

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

//   profileBtn: {
//     position: "relative",
//     background: "var(--accent)",
//     border: "none",
//     borderRadius: "50%",
//     width: 40,
//     height: 40,
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   // dropdown: {
//   //   position: "absolute",
//   //   top: 52,
//   //   right: 0,
//   //   background: "var(--card-bg)",
//   //   border: "1px solid var(--border)",
//   //   borderRadius: 12,
//   //   width: 220,
//   //   boxShadow: "var(--shadow)",
//   //   padding: 12,
//   //   display: "flex",
//   //   flexDirection: "column",
//   //   gap: 8,
//   //   animation: "dropdownIn 0.18s ease-out",
//   //   transformOrigin: "top right",
//   // },

//   dropdown: {
//     position: "absolute",
//     top: 56,
//     right: 0,
//     width: 240,
//     padding: 16,
//     borderRadius: 16,
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,

//     /* 🔥 Glass Effect */
//     background: "rgba(255, 255, 255, 0.08)",
//     backdropFilter: "blur(14px)",
//     WebkitBackdropFilter: "blur(14px)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

//     animation: "dropdownIn 0.2s ease-out",
//     transformOrigin: "top right",
//   },

//   dropdownHeader: {
//     display: "flex",
//     flexDirection: "column",
//     marginBottom: 8,
//     color: "var(--text)",
//   },

//   dropdownItem: {
//     background: "transparent",
//     border: "none",
//     padding: "8px 10px",
//     textAlign: "left",
//     cursor: "pointer",
//     borderRadius: 8,
//     color: "var(--text)",
//     fontSize: 14,
//   },

//   notificationBadge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     minWidth: 18,
//     height: 18,
//     padding: "0 5px",
//     background: "#ef4444",
//     color: "#fff",
//     borderRadius: 999,
//     fontSize: 11,
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "2px solid var(--card-bg)",
//     animation: "pulseBadge 1.5s infinite",
//   },
//   iconBtn: {
//     position: "relative",
//     background: "transparent",
//     border: "none",
//     color: "var(--text)",
//     cursor: "pointer",
//     padding: 8,
//     borderRadius: 8,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// };
