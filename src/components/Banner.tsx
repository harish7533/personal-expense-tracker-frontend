/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useBanner } from "../hooks/useBanner";
import "../styles/Banner.css";

export default function Banner() {
  const { banner, clear } = useBanner();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!banner) return;
    setExiting(false);
  }, [banner]);

  if (!banner) return null;

  const isExpired = banner === "session-expired";

  const close = () => {
    setExiting(true);
    setTimeout(clear, 300); // match CSS duration
  };

  return (
    <div
      className={`banner ${isExpired ? "error" : "info"} ${
        exiting ? "exit" : ""
      }`}
    >
      <span>
        {isExpired
          ? "⚠️ Session expired. Please log in again."
          : "👋 Logged out successfully"}
      </span>

      {isExpired && (
        <button onClick={close} className="close">
          ✕
        </button>
      )}
    </div>
  );
}
