import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./api/queryClient.ts";
import { AuthProvider } from "./features/auth/context/authProvider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<></>}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);
