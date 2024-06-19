import { RouteObject } from "react-router-dom";
import { REPORT_PATHS } from "./constants";
import { lazy } from "react";

const ReportScreen = lazy(() => import("./screens/ReportScreen"));

export const reportRoutes = [
  {
    id: "report",
    path: REPORT_PATHS.REPORT,
    element: <ReportScreen />,
  },
] satisfies RouteObject[];
