import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse } from "@/types";
import { Room } from "../types";
import { ROOM_API_PATHS } from "../constants";

type RequestBody = {
  requestBody: FormData;
};

type ResponseBody = {
  data: { data: { room: Room } } & CommonReponse;
};

const mutationFunctionm = ({ requestBody }: RequestBody) => {
  return api.post<ResponseBody, ResponseBody>(
    ROOM_API_PATHS.ROOM,
    requestBody,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const useAddRoomMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
