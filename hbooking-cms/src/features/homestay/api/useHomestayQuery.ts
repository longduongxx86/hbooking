import { api } from "@/api/api";
import { HOMESTAY_API_PATHS } from "../constants";
import { prepareRequestQuery, RequestQuery, useQuery } from "@/hooks/useQuery";
import { Homestay } from "../types";
import { useSearchParameters } from "@/hooks/useSearchParameters";

type ResponseBody = {
  data: {
    data: {
      homestays: Homestay[];
    };
  };
};

export const queryHomestay = (requestQuery?: RequestQuery) => {
  return {
    queryKey: ["Homestay", requestQuery],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(HOMESTAY_API_PATHS.HOMESTAYS, {
        params: requestQuery,
      }),
    retry: 3,
  };
};

export const useHomestayQuery = (hasNotPagination?: boolean) => {
  if (hasNotPagination) {
    return useQuery(queryHomestay());
  } else {
    const { searchParameters } = useSearchParameters();
    return useQuery(queryHomestay(prepareRequestQuery(searchParameters)));
  }
};
