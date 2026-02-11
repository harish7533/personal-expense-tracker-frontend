import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/theme.css";
import "./styles/Skeleton.css";
import "./styles/page-skeletons.css";
import { AuthProvider } from "./auth/AuthContext";
import { ActivitiesProvider } from "./auth/ActivitiesContext";
import { BalanceProvider } from "./auth/BalanceContext";
import { ThemeProvider } from "./auth/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ActivitiesProvider>
        <BalanceProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BalanceProvider>
      </ActivitiesProvider>
    </AuthProvider>
  </React.StrictMode>,
);
