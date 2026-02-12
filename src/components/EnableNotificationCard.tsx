import { useState } from "react";

const EnableNotificationCard = () => {
  const [enabled, setEnabled] = useState(
    Notification.permission === "granted"
  );

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setEnabled(true);

      new Notification("Notifications Enabled 🎉", {
        body: "You’ll now receive overspending alerts.",
      });
    }
  };

  if (enabled) return null;

  return (
    <div className="glass-card p-4 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold mb-2">
        Enable Spending Alerts
      </h3>
      <p className="text-sm opacity-70 mb-3">
        Get notified when you exceed your monthly budget.
      </p>
      <button
        onClick={requestPermission}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
      >
        Enable Notifications
      </button>
    </div>
  );
};

export default EnableNotificationCard;
