import { api } from "@/api/api";
import { prepareRequestQuery, RequestQuery, useQuery } from "@/hooks/useQuery";
import { BOOKING_API_PATHS } from "../constants";
import { Booking } from "../types";
import { useSearchParameters } from "@/hooks/useSearchParameters";

type ResponseBody = {
  data: {
    data: {
      bookings: Booking[];
    };
  };
};

export const queryBooking = (requestQuery?: RequestQuery) => {
  return {
    queryKey: ["booking", requestQuery],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(BOOKING_API_PATHS.BOOKING, {
        params: requestQuery,
      }),
    retry: 3,
  };
};

export const useListBookingQuery = () => {
  const { searchParameters } = useSearchParameters();
  return useQuery(queryBooking(prepareRequestQuery(searchParameters)));
};
