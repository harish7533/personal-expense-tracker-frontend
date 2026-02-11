import { useEffect, useState } from "react";
import { useBalance } from "../auth/BalanceContext";

export default function BalanceCard() {
  const { balance } = useBalance();
  const safeBalance = balance ?? 0;
  const [animatedBalance, setAnimatedBalance] = useState(balance);

  /* ===== Smooth Animation ===== */
  useEffect(() => {
    if (animatedBalance === safeBalance) return;

    const interval = setInterval(() => {
      setAnimatedBalance((prev) => {
        if (prev < safeBalance) return prev + Math.ceil((safeBalance - prev) / 10);
        if (prev > safeBalance) return prev - Math.ceil((prev - safeBalance) / 10);
        clearInterval(interval);
        return safeBalance;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [safeBalance, animatedBalance]);

  const isLow = safeBalance < 1000;

  return (
    <div
      style={{
        ...styles.card,
        background: isLow
          ? "linear-gradient(135deg, #ff4e50, #f9d423)"
          : "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div>
        <p style={{ opacity: 0.8 }}>Available Balance</p>
        <h1 style={{ margin: 0 }}>₹{animatedBalance.toLocaleString()}</h1>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    padding: 24,
    borderRadius: 20,
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    marginBottom: 30,
    transition: "all 0.4s ease",
  },
};
