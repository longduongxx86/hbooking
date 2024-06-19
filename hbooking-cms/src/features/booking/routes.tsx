import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { BOOKING_PATHS } from "./constants";
import { ListRoomLoader } from "../room/loaders/listRoomsLoader";
import { ListBookingLoader } from "./loaders/listBookingLoader";

const ListBookingScreen = lazy(() => import("./screens/ListBookingScreen"));
const CreateBookingScreen = lazy(() => import("./screens/CreateBookingScreen"));
const DetailBookingScreen = lazy(() => import("./screens/DetailBookingScreen"));

export const bookingRoutes = [
  {
    id: "booking",
    path: BOOKING_PATHS.BOOKING,
    element: <ListBookingScreen />,
    // loader: ListBookingLoader,
  },
  {
    id: "create-booking",
    path: BOOKING_PATHS.ADD_BOOKING,
    element: <CreateBookingScreen />,
    loader: ListRoomLoader,
  },
  {
    id: "detail-booking",
    path: BOOKING_PATHS.DETAIL_BOOKING,
    element: <DetailBookingScreen />,
    loader: ListRoomLoader,
  },
] satisfies RouteObject[];
