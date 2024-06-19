import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { HOMESTAY_API_PATHS } from "../constants";

const mutationFunction = (homestayId: string) => {
  return api.delete(HOMESTAY_API_PATHS.HOMESTAY_DETAIL(homestayId));
};

export const useHomestayDeleteMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
