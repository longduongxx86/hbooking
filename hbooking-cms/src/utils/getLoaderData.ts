import queryClient from "@/api/queryClient";
import { QueryFunction, UseQueryOptions } from "@tanstack/react-query";

type UseQueryParameters<S> = UseQueryOptions<
  S,
  unknown,
  S,
  unknown[] | readonly unknown[]
>;

export const fetchSingleQuery = <T>(queryParameters: UseQueryParameters<T>) => {
  const { queryKey, queryFn, ...queryOptions } = queryParameters;

  return queryClient.fetchQuery({
    queryKey,
    queryFn,
    ...queryOptions,
  });
};
