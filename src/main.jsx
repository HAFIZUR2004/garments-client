import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom"; // ❌ 'react-router' -> 'react-router-dom'
import { AuthProvider } from "./context/AuthProvider.jsx"; // AuthProvider Import
import { router } from "./routes/Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* ✅ AuthContext Wrap */}
     <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
);
