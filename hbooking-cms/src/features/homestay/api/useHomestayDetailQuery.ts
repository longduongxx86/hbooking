import { api } from "@/api/api";
import { HOMESTAY_API_PATHS } from "../constants";
import { useQuery } from "@/hooks/useQuery";
import { Homestay } from "../types";

type ResponseBody = {
  data: {
    code: number;
    message: string;
    data: {
      homestay: Homestay;
    };
  };
};

const queryFunction = (homestayId: string) => {
  return {
    queryKey: ["HomestayDetail", homestayId],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(
        HOMESTAY_API_PATHS.HOMESTAY_DETAIL(homestayId)
      ),
  } as const;
};

export const useHomestayDetailQuery = (homestayId: string) => {
  return useQuery(queryFunction(homestayId));
};
