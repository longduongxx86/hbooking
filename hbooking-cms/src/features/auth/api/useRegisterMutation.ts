import { api } from "@/api/api";
import { AUTH_API_PATHS } from "../constants";
import { RegisterRequest, AuthResponse } from "..";
import { useMutation } from "@/hooks/useMutation";

type ResponseMutation = {
  data: AuthResponse;
};

async function mutationFunction(requestBody: RegisterRequest) {
  return api.post<ResponseMutation, ResponseMutation>(
    AUTH_API_PATHS.REGISTER,
    requestBody
  );
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: mutationFunction });
}
