import { api } from "@/api/api";
import { useQuery } from "@/hooks/useQuery";
import { ROOM_API_PATHS } from "../constants";
import { Room } from "../types";

type ResponseBody = {
  data: {
    code: number;
    message: string;
    data: {
      room: Room;
    };
  };
};

const queryFunction = (roomId: string) => {
  return {
    queryKey: ["RoomDetail", roomId],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(ROOM_API_PATHS.DETAIL(roomId)),
  } as const;
};

export const useRoomDetailQuery = (roomId: string) => {
  return useQuery(queryFunction(roomId));
};
