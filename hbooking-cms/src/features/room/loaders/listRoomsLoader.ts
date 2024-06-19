import { fetchSingleQuery } from "@/utils/getLoaderData";
import { queryRooms } from "../api/useListRoomsQuery";

export const ListRoomLoader = async () => {
  const response = await fetchSingleQuery(queryRooms());
  return response.data;
};
