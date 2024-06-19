import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { SERVICE_API_PATHS } from "../constants";

const mutationFunction = (serviceId: string) => {
  return api.get(SERVICE_API_PATHS.SERVICE(serviceId));
};

export const useServiceDetailMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
