import { api } from "@/api/api";
import { USER_API_PATHS } from "../constants";
import { useMutation } from "@tanstack/react-query";

type ResponseBody = {
  data: { code: number; message: string };
};

type RequestBody = {
  user_name: string;
  password: string;
};

const mutationFunction = (request: RequestBody) => {
  return api.post<ResponseBody, ResponseBody>(
    USER_API_PATHS.RESET_PASSWORD,
    request
  );
};

export const useResetPasswordMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
