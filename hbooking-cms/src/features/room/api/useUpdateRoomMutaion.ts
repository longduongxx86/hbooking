import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse } from "@/types";
import { ROOM_API_PATHS } from "../constants";
import { Room } from "../types";

type RequestBody = {
  id: string;
  data: Pick<
    Room,
    "homestay_id" | "room_name" | "price" | "status" | "room_type"
  >;
};

type ResponseBody = {
  data: { data: { room: Room } } & CommonReponse;
};

const mutationFunctionm = ({ id, data }: RequestBody) => {
  return api.put<ResponseBody, ResponseBody>(ROOM_API_PATHS.DETAIL(id), data);
};

export const useRoomUpdateMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
