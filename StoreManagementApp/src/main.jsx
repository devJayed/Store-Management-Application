import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./Routes/Routers.jsx";
import { RouterProvider } from "react-router-dom";
import AuthProviders from "./providers/AuthProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProviders>
        <div className="max-w-screen-xl mx-auto">
          <RouterProvider router={router} />
        </div>
      </AuthProviders>
    </QueryClientProvider>
  </React.StrictMode>
);
