import { fetchSingleQuery } from "@/utils/getLoaderData";
import { queryServices } from "../api/useListServicesQuery";

export const ListServiceLoader = async () => {
  const response = await fetchSingleQuery(queryServices());
  return response.data;
};
