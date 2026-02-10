import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/theme.css";
import "./styles/Skeleton.css";
import "./styles/page-skeletons.css";
import { AuthProvider } from "./auth/AuthContext";
import { ActivitiesProvider } from "./auth/ActivitiesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ActivitiesProvider>
        <App />
      </ActivitiesProvider>
    </AuthProvider>
  </React.StrictMode>,
);
