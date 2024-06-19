import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse } from "@/types";
import { Booking } from "../types";
import { BOOKING_API_PATHS } from "../constants";

type RequestBody = Omit<Booking, "booking_id" | "user" | "room"> & {
  user_id: number;
  room_id: number;
};
type ResponseBody = {
  data: { data: { booking: Booking } } & CommonReponse;
};

const mutationFunctionm = (requestBody: RequestBody) => {
  return api.post<ResponseBody, ResponseBody>(
    BOOKING_API_PATHS.ADD_BOOKING,
    requestBody
  );
};

export const useAddBookingMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
