import { fetchSingleQuery } from "@/utils/getLoaderData";
import { queryHomestay } from "../api/useHomestayQuery";
import { getAddressText } from "@/hooks/useAddressLocal";

export const HomestayLoader = async () => {
  const response = await fetchSingleQuery(queryHomestay());
  const data = response.data.data.homestays.map((homestay) => {
    const addressText = getAddressText(
      homestay.province,
      homestay.district,
      homestay.ward
    );

    return {
      ...homestay,
      ...addressText,
    };
  });
  return { homestays: data };
};
