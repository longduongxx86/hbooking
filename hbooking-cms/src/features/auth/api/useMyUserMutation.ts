import { api } from "@/api/api";
import { MyUser } from "..";
import { useMutation } from "@/hooks/useMutation";
import { USER_API_PATHS } from "@/features/user";

async function mutationFunction(userId: string) {
  return api.get<MyUser, MyUser>(USER_API_PATHS.MY_USER(userId));
}

export function useMyUserMutation() {
  return useMutation({ mutationFn: mutationFunction });
}
