import { RouteObject } from "react-router-dom";
import { ROOM_PATHS } from "./constants";
import { lazy } from "react";
import { ListRoomLoader } from "./loaders/listRoomsLoader";
import { HomestayLoader } from "../homestay/loaders/HomestayLoader";

const ListRoomScreen = lazy(() => import("./screens/ListRoomScreen"));
const CreateRoomScreen = lazy(() => import("./screens/CreateRoomScreen"));
const DetailRoomScreen = lazy(() => import("./screens/DetailRoomScreen"));

export const roomRoutes = [
  {
    id: "rooms",
    path: ROOM_PATHS.ROOMS,
    element: <ListRoomScreen />,
    // loader: ListRoomLoader,
  },
  {
    id: "add-room",
    path: ROOM_PATHS.CREATE,
    element: <CreateRoomScreen />,
    loader: HomestayLoader,
  },
  {
    id: "detail-room",
    path: ROOM_PATHS.DETAIL,
    element: <DetailRoomScreen />,
    loader: HomestayLoader,
  },
] satisfies RouteObject[];
