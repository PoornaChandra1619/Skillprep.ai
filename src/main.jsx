import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";
import "./theme.css";
import "./netflix-theme.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "781290030877-jck1t8r7ue35skj8llrdm0tg1u88cj8p.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
