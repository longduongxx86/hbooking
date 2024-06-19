import { api } from "@/api/api";
import { prepareRequestQuery, RequestQuery, useQuery } from "@/hooks/useQuery";
import { SERVICE_API_PATHS } from "../constants";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { Service } from "../types";

type ResponseBody = {
  data: {
    data: {
      services: Service[];
    };
  };
};

export const queryServices = (requestQuery?: RequestQuery) => {
  return {
    queryKey: ["services", requestQuery],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(SERVICE_API_PATHS.SERVICES, {
        params: requestQuery,
      }),
    retry: true,
  };
};

export const useListSeviceQuery = () => {
  const { searchParameters } = useSearchParameters();
  return useQuery(queryServices(prepareRequestQuery(searchParameters)));
};
