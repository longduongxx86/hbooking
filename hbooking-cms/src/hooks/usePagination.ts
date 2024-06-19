import { useParams } from "react-router-dom";

export type Pagination = {
  limit: string;
  offset: string;
};

export const usePagination = (): Pagination => {
  const { limit, offset } = useParams();

  return { limit: limit || "8", offset: offset || "0" };
};
