import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import { authRoutes } from "../features/auth/routes";
import ErrorLayout from "../layouts/ErrorLayout/ErrorLayout";
import { userRoutes } from "@/features/user/routes";
import { homestayRoutes } from "@/features/homestay";
import { serviceRoutes } from "@/features/service/routes";
import { roomRoutes } from "@/features/room/routes";
import { bookingRoutes } from "@/features/booking/routes";
import { reportRoutes } from "@/features/report/routes";
import { REPORT_PATHS } from "@/features/report/constants";

export const RootPath = "/";

export const router = createBrowserRouter([
  {
    path: RootPath,
    element: <Navigate to={REPORT_PATHS.REPORT} replace />,
  },
  {
    path: RootPath,
    element: <DefaultLayout />,
    errorElement: <ErrorLayout />,
    children: [
      ...userRoutes,
      ...homestayRoutes,
      ...serviceRoutes,
      ...roomRoutes,
      ...bookingRoutes,
      ...reportRoutes,
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorLayout />,
    children: [...authRoutes],
  },
]);
