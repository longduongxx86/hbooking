import { api } from "@/api/api";
import { useQuery } from "@/hooks/useQuery";
import { AUTH_API_PATHS, MyUser, Session } from "..";

async function queryFunction() {
  return api.get<MyUser, MyUser>(AUTH_API_PATHS.MY_USER);
}

export function myUserQuery(session: Session | null) {
  return {
    queryKey: ["my_user"],
    queryFn: queryFunction,
    enabled: !!session,
    retry: false,
    refetchOnWindowFocus: false,
  };
}

export function useMyUserQuery(session: Session | null) {
  return useQuery(myUserQuery(session));
}
