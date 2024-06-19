import { Homestay } from "../homestay";
import { User } from "../user/types";
import { DATE_TYPE, ENTITY_BY } from "./constants";

export type EntityBy = (typeof ENTITY_BY)[keyof typeof ENTITY_BY];

export type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE];

export type RevenueTime = {
  day: number;
  month: number;
  year: number;
  revenue: number;
};

export type Revenue = {
  homestays: Homestay[];
  user?: User;
  total_revenue: number;
  revenue_breakdowns: RevenueTime[];
};
