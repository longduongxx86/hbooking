import { api } from "@/api/api";
import { USER_API_PATHS } from "../constants";
import { useQuery } from "@/hooks/useQuery";
import { User } from "../types";

type ParamRequest = {
  [k in string]: string;
};
type ResponseBody = {
  data: {
    data: {
      users: User[];
    };
  };
};

const queryFunction = (paramRequest?: ParamRequest) => {
  const params = {
    ...paramRequest,
    limit: paramRequest?.limit || 20,
    offset: paramRequest?.offset || 0,
  } as ParamRequest;

  return {
    queryKey: ["list-user"],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(USER_API_PATHS.LIST_USER, {
        params,
      }),
  };
};

export const useListUserQuery = (paramRequest?: ParamRequest) => {
  return useQuery(queryFunction(paramRequest));
};
