import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/theme.css";
import "./styles/Skeleton.css";
import "./styles/page-skeletons.css";
import { AuthProvider } from "./context/AuthContext";
import { ActivitiesProvider } from "./context/ActivitiesContext";
import { BalanceProvider } from "./context/BalanceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FinanceProvider } from "./context/FincanceContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BalanceProvider>
          <ActivitiesProvider>
            <FinanceProvider>
              <App />
            </FinanceProvider>
          </ActivitiesProvider>
        </BalanceProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
