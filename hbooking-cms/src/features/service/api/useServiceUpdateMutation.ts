import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { SERVICE_API_PATHS } from "../constants";
import { Service } from "..";
import { CommonReponse } from "@/types";

type RequestBody = {
  service_id: string | number;
  service_name: string;
  description: string;
  price: number;
};

type ResponseBody = {
  data: { data: { service: Service } } & CommonReponse;
};

const mutationFunctionm = (requestBody: RequestBody) => {
  const { service_id, ...body } = requestBody;
  return api.put<ResponseBody, ResponseBody>(
    SERVICE_API_PATHS.SERVICE(service_id),
    body
  );
};

export const useServiceUpdateMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
