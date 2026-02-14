/* eslint-disable react-hooks/set-state-in-effect */
import {
  Home,
  NotebookPenIcon,
  PlusCircle,
  User,
  Activity,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust if needed
import { useTheme } from "../context/ThemeContext"; // adjust if needed
import "../styles/MobileNav.css";

export default function MobileNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const currentY = useRef(0);

  const navItems = [
    { icon: Home, path: "/dashboard" },
    { icon: NotebookPenIcon, path: "/bills" },
    { icon: PlusCircle, path: "/create" },
    { icon: Activity, path: "/activity" },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ================= NAV BAR ================= */}
      <nav
        className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        backdrop-blur-2xl
        bg-white/70 dark:bg-black/60
        border-t border-white/20 dark:border-white/10
        shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
      "
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-around items-center h-16 relative">
          {navItems.map(({ icon: Icon, path }) => {
            const active = location.pathname === path;
            const isCreate = path === "/create";

            return (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center justify-center
                  transition-all duration-300
                  ${isCreate ? "translate-y-[-18px]" : ""}
                `}
              >
                {isCreate ? (
                  <div
                    className={`
                    w-14 h-14 rounded-full
                    flex items-center justify-center
                    shadow-xl transition-all duration-300
                    ${
                      active
                        ? "bg-green-500 text-white scale-110"
                        : "bg-gradient-to-br from-green-400 to-emerald-600 text-white"
                    }
                  `}
                  >
                    <Icon size={26} />
                  </div>
                ) : (
                  <div
                    className={`
                    transition-all duration-300
                    ${
                      active
                        ? "text-green-500 scale-110"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                  >
                    <Icon size={22} />
                  </div>
                )}

                {!isCreate && active && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-green-500" />
                )}
              </Link>
            );
          })}

          {/* 👤 USER BUTTON */}
          {user && (
            <button
              onClick={() => setOpen(true)}
              className="text-gray-500 dark:text-gray-400 transition-all"
            >
              <User size={22} />
            </button>
          )}
        </div>
      </nav>

      {/* ================= BOTTOM SHEET ================= */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              startY.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              if (startY.current === null) return;

              const delta = e.touches[0].clientY - startY.current;

              if (delta > 0 && sheetRef.current) {
                currentY.current = delta;
                sheetRef.current.style.transform = `translateY(${delta}px)`;
              }
            }}
            onTouchEnd={() => {
              if (currentY.current > 100) {
                setOpen(false);
              } else if (sheetRef.current) {
                sheetRef.current.style.transform = "translateY(0)";
              }

              startY.current = null;
              currentY.current = 0;
            }}
            className="
        w-full rounded-t-3xl p-6
        bg-white dark:bg-zinc-900
        transition-transform duration-300
      "
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Drag Indicator */}
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <div className="space-y-4">
              {/* Theme */}
              <button
                onClick={() => {
                  toggleTheme();
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl
          hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-3 w-full p-3 rounded-xl
          text-red-500 hover:bg-red-500/10 transition"
              >
                <LogOut size={18} />
                Logout
              </button>

              {/* Cancel */}
              <button
                onClick={() => setOpen(false)}
                className="w-full text-center text-sm opacity-60 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
