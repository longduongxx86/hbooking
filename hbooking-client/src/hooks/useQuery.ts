import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useQueryTanstack,
} from "@tanstack/react-query";

export function useQuery<
  TQueryFunctionData = unknown,
  TError = unknown,
  TData = TQueryFunctionData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryOptions: UseQueryOptions<TQueryFunctionData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const query = useQueryTanstack(queryOptions);
  return query;
}
