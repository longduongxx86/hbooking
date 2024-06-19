import { RouteObject } from "react-router-dom";
import { AUTH_PATHS, ROUTE_ID } from ".";
import { lazy } from "react";

const SignInScreen = lazy(() => import("./screens/SignInScreen/SignInScreen"));
const SignUpScreen = lazy(() => import("./screens/SignUpScreen/SignUpScreen"));

export const authRoutes = [
  {
    id: ROUTE_ID.SIGN_IN,
    path: AUTH_PATHS.SIGN_IN,
    element: <SignInScreen />,
  },
  {
    id: ROUTE_ID.SIGN_UP,
    path: AUTH_PATHS.SIGN_UP,
    element: <SignUpScreen />,
  },
] satisfies RouteObject[];
