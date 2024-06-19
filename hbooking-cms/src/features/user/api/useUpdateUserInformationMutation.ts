import { api } from "@/api/api";
import { USER_API_PATHS } from "../constants";
import { useMutation } from "@tanstack/react-query";
import { ResponseBody } from "@/features/auth";

type RequestBody = {
  id: number;
  request: FormData;
};

type Response = {
  data: ResponseBody;
};

const mutationFunction = ({ id, request }: RequestBody) => {
  return api.put<Response, Response>(USER_API_PATHS.MY_USER(id), request, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useUpdateUserInformationMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
