import { useState } from "react";
import toast from "react-hot-toast";
import { setInitialBalance } from "../api/balance";
import { useActivities } from "../auth/ActivitiesContext";
import { useAuth } from "../auth/AuthContext";

export default function SetBalance() {
  const [amount, setAmount] = useState<number>(0);
  const { refreshActivities } = useActivities();
  const { user, loading } = useAuth();

  const handleSetBalance = async () => {
    if (amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      if (!loading && user) {
        await setInitialBalance(amount); // ✅ API call
        await refreshActivities(); // 🔄 reload activities

        toast.success("Initial balance set successfully");
      }
    } catch (err) {
      toast.error(`Failed to set balance ${err}`);
    }
  };

  return (
    <div>
      <h3>Set Initial Balance</h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button onClick={handleSetBalance}>Set Balance</button>
    </div>
  );
}
