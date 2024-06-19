import { RouteObject } from "react-router-dom";
import { SERVICE_PATHS } from "./constants";
import { lazy } from "react";
import { ListServiceLoader } from "./loaders/listServicesLoader";

const ListServiceScreen = lazy(() => import("./screens/ListServiceScreen"));

export const serviceRoutes = [
  {
    id: "serviecs",
    path: SERVICE_PATHS.SERVICES,
    element: <ListServiceScreen />,
    // loader: ListServiceLoader,
  },
] satisfies RouteObject[];
