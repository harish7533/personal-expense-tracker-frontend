/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { markAllAsRead } from "../api/activity";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivitiesContext";
import "../styles/NavBar.css";

import {
  Home,
  NotebookPenIcon,
  PlusCircle,
  LogOut,
  Sun,
  Moon,
  Settings,
  Bell,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading } = useAuth();
  const { activities, refreshActivities } = useActivities();

  const [desktopOpen, setDesktopOpen] = useState(false);
  // const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  // const sheetRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // const startY = useRef<number | null>(null);
  // const currentY = useRef(0);
  // const startTime = useRef(0);

  const unreadCount = activities?.filter((a: any) => !a?.read)?.length ?? 0;

  function getInitials(name?: string | null) {
    if (!name) return "U";
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const initials = getInitials(user?.username);

  const navItems = [
    { icon: Home, path: "/dashboard" },
    { icon: NotebookPenIcon, path: "/bills" },
    { icon: PlusCircle, path: "/create", center: true },
    { icon: Bell, path: "/activity" },

    ...(user
      ? [
          {
            icon: LogOut,
            action: "logout",
          },
        ]
      : [
        {
            icon: theme === "dark" ? Sun : Moon,
            action: "theme",
          }
      ]),
  ];

  /* ================= ACTIVE INDICATOR ================= */
  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;

    const activeIndex = navItems.findIndex(
      (item) => item.path === location.pathname,
    );

    if (activeIndex === -1) return;

    const navWidth = navRef.current.offsetWidth;
    const itemWidth = navWidth / navItems.length;

    indicatorRef.current.style.width = `${itemWidth}px`;
    indicatorRef.current.style.transform = `translateX(${
      itemWidth * activeIndex
    }px)`;
  }, [location.pathname]);

  // /* ================= AUTO CLOSE MOBILE ON ROUTE ================= */
  // useEffect(() => {
  //   setMobileOpen(false);
  // }, [location.pathname]);

  /* ================= DESKTOP OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDesktopOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= AUTO MARK AS READ ================= */
  useEffect(() => {
    if (desktopOpen && unreadCount > 0) {
      markAllAsRead()
        .then(() => refreshActivities())
        .catch(() => {});
    }
  }, [desktopOpen, unreadCount, refreshActivities]);

  if (loading) return null;

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      <nav className="navbar-desktop">
        <h3 className="navbar-logo" onClick={() => navigate("/dashboard")}>
          🧾 Expense Tracker
        </h3>

        <div className="navbar-right">
          {user && (
            <div className="nav-icon-wrapper">
              <button
                onClick={() => navigate("/activity")}
                className="nav-icon-btn"
              >
                <Bell size={18} />
              </button>

              {unreadCount > 0 && (
                <span className="nav-badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          )}

          {user && (
            <button
              onClick={() => navigate("/settings")}
              className="nav-icon-btn"
            >
              <Settings size={18} />
            </button>
          )}

          <div className="nav-profile" ref={dropdownRef}>
            <button
              onClick={() => setDesktopOpen((prev) => !prev)}
              className="nav-avatar"
            >
              {user ? initials : theme === "dark" ? "🌞" : "🌙"}
            </button>

            {desktopOpen && (
              <div className="nav-dropdown">
                <div className="nav-user-info">
                  <p className="nav-username">{user?.username}</p>
                  <p className="nav-email">{user?.email}</p>
                </div>

                <button onClick={toggleTheme} className="dropdown-btn">
                  {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  Toggle Theme
                </button>

                {user && (
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="dropdown-btn logout"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE TOP TITLE ================= */}
      <div className="mobile-top-bar">
        <h4 className="mobile-title" onClick={() => navigate("/dashboard")}>
          🧾 Expense Tracker
        </h4>
      </div>

      {/* ================= MOBILE DOCK ================= */}
      <nav className="navbar-mobile">
        <div className="mobile-nav-inner" ref={navRef}>
          <div ref={indicatorRef} className="active-indicator" />

          {navItems.map(({ icon: Icon, path, center, action }) => {
            const active = location.pathname === path;

            if (center) {
              return (
                <Link key={path} to={path} className="floating-create-wrapper">
                  <div className="floating-create-btn">
                    <Icon size={26} />
                  </div>
                </Link>
              );
            }

            // 🔥 If item has path → normal navigation
            if (path) {
              return (
                <Link
                  key={path}
                  to={path}
                  className={`mobile-link ${active ? "active" : ""}`}
                >
                  <Icon size={22} />
                </Link>
              );
            }

            // 🔥 If item has action
            if (action === "theme") {
              return (
                <button
                  key="theme"
                  onClick={toggleTheme}
                  className="mobile-link"
                  style={{ background: "var(--background" }}
                >
                  <Icon size={22} />
                </button>
              );
            }

            if (action === "logout") {
              return (
                <button
                  key="logout"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="mobile-link"                  
                  style={{ background: "var(--background" }}
                >
                  <Icon size={22} />
                </button>
              );
            }

            return null;
          })}
        </div>

        {/* ================= MOBILE SHEET ================= */}
        {/* {mobileOpen && (
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)}>
            <div
              ref={sheetRef}
              className="mobile-sheet animated"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                startY.current = e.touches[0].clientY;
                startTime.current = Date.now();
              }}
              onTouchMove={(e) => {
                if (startY.current === null || !sheetRef.current) return;

                const delta = e.touches[0].clientY - startY.current;

                if (delta > 0) {
                  currentY.current = delta;

                  // rubber band effect
                  const resistance = delta * 0.6;

                  sheetRef.current.style.transform = `translateY(${resistance}px)`;
                }
              }}
              onTouchEnd={() => {
                if (!sheetRef.current) return;

                const delta = currentY.current;
                const duration = Date.now() - startTime.current;
                const velocity = delta / duration;

                // Close conditions:
                // 1. Dragged enough distance
                // 2. Fast swipe
                if (delta > 120 || velocity > 0.6) {
                  sheetRef.current.style.transform = "translateY(100%)";

                  setTimeout(() => {
                    setMobileOpen(false);
                    sheetRef.current!.style.transform = "translateY(0)";
                  }, 250);
                } else {
                  sheetRef.current.style.transform = "translateY(0)";
                }

                startY.current = null;
                currentY.current = 0;
              }}
            >
              <div className="sheet-handle" />

              <button onClick={toggleTheme} className="">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                Toggle Theme
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="sheet-btn logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )} */}
      </nav>
    </>
  );
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

// profileBtn: {
//   position: "relative",
//   background: "var(--accent)",
//   border: "none",
//   borderRadius: "50%",
//   width: 40,
//   height: 40,
//   fontSize: 14,
//   fontWeight: 600,
//   color: "#fff",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// },

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

//  return (
//     <>
//       {/* ================= DESKTOP NAV ================= */}
//       <nav
//         className="hidden md:flex fixed top-0 left-0 right-0 z-50
//         items-center justify-between px-6 h-16
//         backdrop-blur-xl bg-white/60 dark:bg-black/40
//         border-b border-white/20 dark:border-white/10
//         shadow-sm"
//       >
//         <h3
//           className="text-lg font-semibold cursor-pointer"
//           onClick={() => navigate("/dashboard")}
//         >
//           🧾 Expense Tracker
//         </h3>

//         <div className="flex items-center gap-4">
//           {user && (
//             <div className="relative">
//               <button
//                 onClick={() => navigate("/activity")}
//                 className="p-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition"
//               >
//                 <Bell size={18} />
//               </button>

//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
//                   {unreadCount > 9 ? "9+" : unreadCount}
//                 </span>
//               )}
//             </div>
//           )}

//           {user && (
//             <button
//               onClick={() => navigate("/settings")}
//               className="p-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition"
//             >
//               <Settings size={18} />
//             </button>
//           )}

//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setDesktopOpen((prev) => !prev)}
//               className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center shadow-md"
//             >
//               {user ? initials : theme === "dark" ? "🌞" : "🌙"}
//             </button>

//             {desktopOpen && (
//               <div className="absolute right-0 mt-3 w-52 backdrop-blur-xl bg-white/80 dark:bg-black/60 border border-white/20 dark:border-white/10 shadow-xl rounded-xl p-2">
//                 {user && (
//                   <>
//                     <div className="px-3 py-2 text-sm border-b border-white/20">
//                       <p className="font-semibold">{user?.username}</p>
//                       <p className="text-xs opacity-70">{user?.email}</p>
//                     </div>

//                     <button
//                       onClick={() => {
//                         toggleTheme();
//                         setDesktopOpen(false);
//                       }}
//                       className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-white/30 dark:hover:bg-white/10"
//                     >
//                       {theme === "dark" ? (
//                         <Sun size={14} />
//                       ) : (
//                         <Moon size={14} />
//                       )}
//                       Toggle Theme
//                     </button>

//                     <button
//                       onClick={() => {
//                         logout();
//                         navigate("/login");
//                       }}
//                       className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-500/10"
//                     >
//                       <LogOut size={14} />
//                       Logout
//                     </button>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* ================= MOBILE NAV ================= */}
//       <nav
//         className="md:hidden fixed bottom-0 left-0 right-0 z-50
//         backdrop-blur-2xl bg-white/70 dark:bg-black/60
//         border-t border-white/20 dark:border-white/10
//         shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
//         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
//       >
//         <div className="flex justify-around items-center h-16 relative">
//           {navItems.map(({ icon: Icon, path }) => {
//             const active = location.pathname === path;
//             const isCreate = path === "/create";

//             return (
//               <Link
//                 key={path}
//                 to={path}
//                 className={`relative flex items-center justify-center transition-all duration-300 ${
//                   isCreate ? "translate-y-[-18px]" : ""
//                 }`}
//               >
//                 {isCreate ? (
//                   <div
//                     className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl ${
//                       active
//                         ? "bg-green-500 text-white scale-110"
//                         : "bg-gradient-to-br from-green-400 to-emerald-600 text-white"
//                     }`}
//                   >
//                     <Icon size={26} />
//                   </div>
//                 ) : (
//                   <div
//                     className={`${
//                       active
//                         ? "text-green-500 scale-110"
//                         : "text-gray-500 dark:text-gray-400"
//                     }`}
//                   >
//                     <Icon size={22} />
//                   </div>
//                 )}
//               </Link>
//             );
//           })}

//           {user && (
//             <button
//               onClick={() => setMobileOpen(true)}
//               className="text-gray-500 dark:text-gray-400"
//             >
//               <User size={22} />
//             </button>
//           )}
//         </div>
//       </nav>

//       {/* ================= MOBILE BOTTOM SHEET ================= */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-[60] flex items-end bg-black/40 backdrop-blur-sm"
//           onClick={() => setMobileOpen(false)}
//         >
//           <div
//             ref={sheetRef}
//             onClick={(e) => e.stopPropagation()}
//             onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
//             onTouchMove={(e) => {
//               if (startY.current === null || !sheetRef.current) return;

//               const delta = e.touches[0].clientY - startY.current;

//               if (delta > 0) {
//                 currentY.current = delta;
//                 sheetRef.current.style.transform = `translateY(${delta}px)`;
//               }
//             }}
//             onTouchEnd={() => {
//               if (currentY.current > 100) {
//                 setMobileOpen(false);
//               } else if (sheetRef.current) {
//                 sheetRef.current.style.transform = "translateY(0)";
//               }

//               startY.current = null;
//               currentY.current = 0;
//             }}
//             className="w-full rounded-t-3xl p-6 bg-white dark:bg-zinc-900 transition-transform duration-300"
//             style={{
//               paddingBottom: "env(safe-area-inset-bottom)",
//             }}
//           >
//             <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

//             <button
//               onClick={toggleTheme}
//               className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
//             >
//               {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//               Toggle Theme
//             </button>

//             <button
//               onClick={() => {
//                 logout();
//                 navigate("/login");
//               }}
//               className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
