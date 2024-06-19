import { fetchSingleQuery } from "@/utils/getLoaderData";
import { queryBooking } from "../api/useListBookingQuery";

export const ListBookingLoader = async () => {
  const response = await fetchSingleQuery(queryBooking());
  return response.data.data;
};
