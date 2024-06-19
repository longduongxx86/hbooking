import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse } from "@/types";
import { BOOKING_API_PATHS } from "../constants";
import { Booking } from "../types";

type RequestBody = {
  id: string;
  data: Omit<
    Booking,
    "booking_id" | "user" | "room" | "created_at" | "updated_at"
  > & {
    user_id: number;
    room_id: number;
  };
};

type ResponseBody = {
  data: { data: { booking: Booking } } & CommonReponse;
};

const mutationFunctionm = ({ id, data }: RequestBody) => {
  return api.put<ResponseBody, ResponseBody>(
    BOOKING_API_PATHS.UPDATE_BOOKING(id),
    data
  );
};

export const useUpdateBookingMutation = () => {
  return useMutation({ mutationFn: mutationFunctionm });
};
