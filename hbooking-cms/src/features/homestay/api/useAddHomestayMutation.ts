import { api } from "@/api/api";
import { HOMESTAY_API_PATHS } from "../constants";
import { Homestay } from "..";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse } from "@/types";

type RequestBody = {
  requestBody: FormData;
};

type ResponseBody = {
  data: { data: { homestay: Homestay } } & CommonReponse;
};

const mutationFunctionm = ({ requestBody }: RequestBody) => {
  return api.post<ResponseBody, ResponseBody>(
    HOMESTAY_API_PATHS.HOMESTAYS,
    requestBody,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const useAddHomestayMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
