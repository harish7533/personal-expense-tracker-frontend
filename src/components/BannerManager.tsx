/* eslint-disable react-refresh/only-export-components */
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import "../styles/Banner.css";

interface BannerProps {
  message: string;
  type?: "info" | "success" | "error";
  autoDismiss?: boolean;
  duration?: number;
}

export function showBanner({
  message,
  type = "info",
  autoDismiss = true,
  duration = 3000,
}: BannerProps) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);
  const dismiss = () => {
    root.unmount();
    container.remove();
  };

  root.render(
    <Banner
      message={message}
      type={type}
      autoDismiss={autoDismiss}
      duration={duration}
      onDismiss={dismiss}
    />
  );
}

function Banner({
  message,
  type,
  autoDismiss,
  duration = 3000,
  onDismiss,
}: BannerProps & { onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeout1: ReturnType<typeof setTimeout>;
    let timeout2: ReturnType<typeof setTimeout>;

    if (autoDismiss) {
      timeout1 = setTimeout(() => setVisible(false), duration);
      timeout2 = setTimeout(onDismiss, duration + 300); // allow fade out
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [autoDismiss, duration, onDismiss]);

  return (
    <div className={`banner ${type} ${visible ? "slide-in" : "fade-out"}`}>
      {message}
    </div>
  );
}
