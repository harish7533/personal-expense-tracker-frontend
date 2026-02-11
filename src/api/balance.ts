import api from "../api";

/**
 * Set user's initial balance
 * Backend: POST /balance
 */
export const setInitialBalance = (amount: number) => {
  return api.post(
    "/balance/setBalance",
    { amount },
    {
      withCredentials: true,
    }
  );
};
