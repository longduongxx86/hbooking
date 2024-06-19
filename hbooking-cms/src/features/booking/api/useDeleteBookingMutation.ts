import { api } from "@/api/api";
import { useMutation } from "@/hooks/useMutation";
import { BOOKING_API_PATHS } from "../constants";

const mutationFunction = (bookingId: string) => {
  return api.delete(BOOKING_API_PATHS.DELETE_BOOKING(bookingId));
};

export const useDeleteBookingMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
