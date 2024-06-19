import dayjs from "dayjs";
import { RevenueTime } from "../types";
import { formatter } from "@/utils/formatter";

type RecentSalesProps = {
  revenueBreakdowns: RevenueTime[] | undefined;
};

export function RecentSales({ revenueBreakdowns }: RecentSalesProps) {
  const getDate = (revenue: RevenueTime) => {
    const time = `${revenue.month}-${revenue.day}-${revenue.year}`;
    return dayjs(time).format("DD-MM-YYYY");
  };

  return (
    <div className="space-y-8">
      {revenueBreakdowns &&
        revenueBreakdowns?.map((revenue, index) => (
          <div key={index} className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {getDate(revenue)}
              </p>
            </div>
            <div className="ml-auto font-medium">
              {formatter.format(revenue.revenue)}
            </div>
          </div>
        ))}
    </div>
  );
}
