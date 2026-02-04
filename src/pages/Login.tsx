/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import api from "../api"; // ✅ use your axios instance
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post(
        "/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      console.log("Saved token:", localStorage.getItem("token"));

       navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>🔐 Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleLogin} className="submit">Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
