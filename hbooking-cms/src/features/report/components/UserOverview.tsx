import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { DateType, RevenueTime } from "../types";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { useMemo } from "react";
import { DATE_TYPE } from "../constants";
import dayjs from "dayjs";

type RecentSalesProps = {
  revenueBreakdowns: RevenueTime[] | undefined;
};

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function UserOverview({ revenueBreakdowns }: RecentSalesProps) {
  console.log(revenueBreakdowns);
  const { searchParameters } = useSearchParameters();

  const yearData = () => {
    const core = revenueBreakdowns?.reduce((result, revenue) => {
      result[revenue.year] = (result[revenue.year] || 0) + revenue.revenue;
      return result;
    }, {} as { [k in string]: number });

    const valueByYears =
      core &&
      Object.keys(core).map((year) => ({
        name: year,
        total: core[year],
      }));

    return valueByYears;
  };

  const monthData = () => {
    const core = revenueBreakdowns?.reduce((result, revenue) => {
      const keyTime = `${revenue.month}-${revenue.year}`;

      result[keyTime] = (result[keyTime] || 0) + revenue.revenue;
      return result;
    }, {} as { [k in string]: number });

    const value =
      core &&
      Object.keys(core).map((month) => ({
        name: month,
        total: core[month],
      }));

    return value;
  };
  const dayData = () => {
    const core = revenueBreakdowns?.reduce((result, revenue) => {
      const keyTime = dayjs(`${revenue.month}-${revenue.day}-${revenue.year}`)
        .format("DD-MM-YYYY")
        .toString();

      result[keyTime] = (result[keyTime] || 0) + revenue.revenue;
      return result;
    }, {} as { [k in string]: number });

    const value =
      core &&
      Object.keys(core).map((month) => ({
        name: month,
        total: core[month],
      }));

    return value;
  };

  const data = useMemo(() => {
    switch (searchParameters.mode) {
      case DATE_TYPE.DAY.toString():
        return dayData();
      case DATE_TYPE.MONTH.toString():
        return monthData();
      default:
        return yearData();
    }
  }, [searchParameters]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
