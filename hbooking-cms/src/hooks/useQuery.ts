import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useQueryTanstack,
} from "@tanstack/react-query";
import { QueryParameters } from "./useSearchParameters";
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from "@/constants/constants";
import { DateType, EntityBy } from "@/features/report/types";
import { DATE_TYPE, ENTITY_BY } from "@/features/report/constants";
import { useAuthStore } from "@/store";
import dayjs from "dayjs";

export type ReportQuery = {
  homestay_id?: string;
  user_id?: string;
  from?: string;
  to?: string;
  by: EntityBy;
  mode: DateType;
};

export type RequestQuery = {
  // offset?: number;
  // limit?: number;
  [K in string]: string | number;
};

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

export const prepareRequestQuery = (searchParameters: QueryParameters) => {
  return {
    ...searchParameters,
    offset: searchParameters.offset
      ? Number(searchParameters.offset)
      : OFFSET_DEFAULT,
    limit: searchParameters.limit
      ? Number(searchParameters.limit)
      : LIMIT_DEFAULT,
  } satisfies RequestQuery;
};

export const prepareReportRequestQuery = (
  searchParameters: QueryParameters
) => {
  const { user } = useAuthStore();
  const currentYear = dayjs().year();

  return {
    homestay_id: JSON.stringify(
      searchParameters.homestay_id?.split(",").map(Number)
    ),
    user_id:
      (!searchParameters.homestay_id && searchParameters.user_id) ||
      (searchParameters.homestay_id ? "" : user.user_id?.toString()),
    from:
      searchParameters.from ||
      dayjs(`01-01-${currentYear}`).valueOf().toString(),
    to:
      searchParameters.to ||
      dayjs(dayjs().format("DD-MM-YYYY")).valueOf().toString(),
    by: (Number(searchParameters.by) as EntityBy) || ENTITY_BY.USER,
    mode: (Number(searchParameters.mode) as DateType) || DATE_TYPE.YEAR,
  } satisfies ReportQuery;
};
