import { api } from "@/api/api";
import { prepareRequestQuery, RequestQuery, useQuery } from "@/hooks/useQuery";
import { ROOM_API_PATHS } from "../constants";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { Room } from "../types";

type ResponseBody = {
  data: {
    data: {
      rooms: Room[];
    };
  };
};

export const queryRooms = (requestQuery?: RequestQuery) => {
  return {
    queryKey: ["rooms", requestQuery],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(ROOM_API_PATHS.ROOM, {
        params: requestQuery,
      }),
    retry: 3,
  };
};

export const useListRoomQuery = () => {
  const { searchParameters } = useSearchParameters();
  return useQuery(queryRooms(prepareRequestQuery(searchParameters)));
};
