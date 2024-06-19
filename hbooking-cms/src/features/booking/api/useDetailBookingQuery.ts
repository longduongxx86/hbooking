import { api } from "@/api/api";
import { useQuery } from "@/hooks/useQuery";
import { BOOKING_API_PATHS } from "../constants";
import { Booking } from "../types";

type ResponseBody = {
  data: {
    code: number;
    message: string;
    data: {
      booking: Booking;
    };
  };
};

const queryFunction = (bookingId: string) => {
  return {
    queryKey: ["BookingDetail", bookingId],
    queryFn: () =>
      api.get<ResponseBody, ResponseBody>(
        BOOKING_API_PATHS.GET_BOOKING(bookingId)
      ),
  } as const;
};

export const useDetailBookingQuery = (bookingId: string) => {
  return useQuery(queryFunction(bookingId));
};
