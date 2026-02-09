import { useState } from "react";

export type BannerType = "session-expired" | "logged-out" | null;

let banner: BannerType = null;
const listeners: (() => void)[] = [];
let timeout: number | null = null;

export function useBanner() {
  const [, setTick] = useState(0);
  const notify = () => setTick((n) => n + 1);

  if (!listeners.includes(notify)) {
    listeners.push(notify);
  }

  return {
    banner,

    show(type: BannerType) {
      banner = type;
      listeners.forEach((l) => l());

      // ⏱ Auto-dismiss ONLY for logout banner
      if (type === "logged-out") {
        if (timeout) window.clearTimeout(timeout);

        timeout = window.setTimeout(() => {
          banner = null;
          listeners.forEach((l) => l());
        }, 3000);
      }
    },

    clear() {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      banner = null;
      listeners.forEach((l) => l());
    },
  };
}
