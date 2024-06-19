import ErrorRoute from "@/components/ErrorRoute";
import { authRoutes } from "@/features/auth";
import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <ErrorRoute />,
    children: [],
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorRoute />,
    children: [...authRoutes],
  },
]);
