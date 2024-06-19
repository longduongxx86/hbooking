import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./features/auth/context/authProvider";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import "./index.css";
import queryClient from "./api/queryClient";
import { Toaster } from "./shared/components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <Toaster />
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);
