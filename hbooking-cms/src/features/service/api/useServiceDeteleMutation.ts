import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { SERVICE_API_PATHS } from "../constants";

const mutationFunction = (serviceId: string) => {
  return api.delete(SERVICE_API_PATHS.SERVICE(serviceId));
};

export const useServiceDeleteMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
