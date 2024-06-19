import { RouteObject } from "react-router-dom";
import { HOMESTAY_PATHS } from "./constants";
import { lazy } from "react";
import { HomestayLoader } from "./loaders/HomestayLoader";
const HomestayScreen = lazy(() => import("./screens/HomestayScreen"));
const ModifyHomestayScreen = lazy(
  () => import("./screens/ModifyHomestayScreen")
);
const DetailHomestayScreen = lazy(
  () => import("./screens/DetailHomestayScreen")
);

export const homestayRoutes = [
  // {
  //   id: "homestay-v2",
  //   path: "/",
  //   element: <HomestayScreen />,
  //   loader: HomestayLoader,
  // },
  {
    id: "homestay",
    path: HOMESTAY_PATHS.HOMESTAY,
    element: <HomestayScreen />,
    // loader: HomestayLoader,
  },
  {
    id: "homestay-create",
    path: HOMESTAY_PATHS.HOMESTAY_MODIFY,
    element: <ModifyHomestayScreen />,
  },
  {
    id: "homestay-detail",
    path: HOMESTAY_PATHS.HOMESTAY_DETAIL,
    element: <DetailHomestayScreen />,
  },
] satisfies RouteObject[];
