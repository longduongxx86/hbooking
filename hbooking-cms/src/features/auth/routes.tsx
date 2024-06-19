import { RouteObject } from "react-router-dom";
import { AUTH_PATHS } from "./constants";
import { lazy } from "react";

const LoginScreen = lazy(() => import("./screens/LoginScreen"));
const RegisterScreen = lazy(() => import("./screens/RegisterScreen"));

export const authRoutes = [
  {
    id: "login",
    path: AUTH_PATHS.LOG_IN,
    element: <LoginScreen />,
  },
  {
    id: "register",
    path: AUTH_PATHS.REGISTER,
    element: <RegisterScreen />,
  },
] satisfies RouteObject[];
