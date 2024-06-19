import { api } from "@/api/api";
import {
  useQuery,
  ReportQuery,
  prepareReportRequestQuery,
} from "@/hooks/useQuery";
import { REPORT_API_PATHS } from "../constants";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { Revenue } from "../types";

type ReportResponse = {
  data: {
    data: {
      revenue: Revenue;
    };
  };
};

const queryFunction = (params: ReportQuery) => {
  return {
    queryKey: ["report", params],
    queryFn: () =>
      api.get<ReportResponse, ReportResponse>(REPORT_API_PATHS.REPORT, {
        params,
      }),
  };
};

export const useReportQuery = () => {
  const { searchParameters } = useSearchParameters();
  return useQuery(queryFunction(prepareReportRequestQuery(searchParameters)));
};
