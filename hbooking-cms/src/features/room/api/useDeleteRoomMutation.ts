import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { ROOM_API_PATHS } from "../constants";

const mutationFunction = (homestayId: string) => {
  return api.delete(ROOM_API_PATHS.DELETE(homestayId));
};

export const useRoomDeleteMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
