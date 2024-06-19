import { api } from "@/api/api";
import { HOMESTAY_API_PATHS } from "../constants";
import { Homestay } from "..";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse } from "@/types";

type RequestBody = {
  id: string;
  data: Pick<
    Homestay,
    "name" | "ward" | "district" | "province" | "description"
  >;
};

type ResponseBody = {
  data: { data: { homestay: Homestay } } & CommonReponse;
};

const mutationFunctionm = ({ id, data }: RequestBody) => {
  return api.put<ResponseBody, ResponseBody>(
    HOMESTAY_API_PATHS.HOMESTAY_DETAIL(id),
    data
  );
};

export const useHomestayUpdateMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
