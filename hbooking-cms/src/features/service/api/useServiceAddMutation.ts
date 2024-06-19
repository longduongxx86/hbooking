import { api } from "@/api/api";
import { SERVICE_API_PATHS } from "../constants";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse } from "@/types";
import { Service } from "../types";

type RequestBody = {
  service_name: string;
  description: string;
  price: number;
};

type ResponseBody = {
  data: { data: { service: Service } } & CommonReponse;
};

const mutationFunctionm = (requestBody: RequestBody) => {
  return api.post<ResponseBody, ResponseBody>(
    SERVICE_API_PATHS.SERVICES,
    requestBody
  );
};

export const useServiceAddMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
