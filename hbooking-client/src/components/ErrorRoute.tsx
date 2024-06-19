import { useRouteError } from "react-router-dom";
import NotFound from "./NotFound";
import { STATUS_CODE } from "@/constants/constants";

export default function ErrorRoute() {
  const error = useRouteError() as {
    status?: number;
  };

  if (error?.status === STATUS_CODE.NOT_FOUND) return <NotFound />;

  return error?.status;
}
