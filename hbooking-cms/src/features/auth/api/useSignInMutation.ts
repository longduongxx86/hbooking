import { api } from "@/api/api";
import { AUTH_API_PATHS } from "../constants";
import { useMutation } from "@/hooks/useMutation";
import { AuthResponse, SignInResponse } from "..";

type ResponseMutation = {
  data: AuthResponse;
};

async function mutationFunction(requestBody: SignInResponse) {
  return api.post<ResponseMutation, ResponseMutation>(
    AUTH_API_PATHS.LOG_IN,
    requestBody
  );
}

export function useSignInMutation() {
  return useMutation({ mutationFn: mutationFunction });
}
