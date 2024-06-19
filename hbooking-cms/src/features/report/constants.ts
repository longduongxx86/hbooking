export const REPORT_PATHS = {
  REPORT: "/report",
} as const;

export const REPORT_API_PATHS = {
  REPORT: "/report/revenue",
} as const;

export const ENTITY_BY = {
  HOMESTAY: 1,
  USER: 2,
} as const;

export const DATE_TYPE = {
  DAY: 1,
  MONTH: 2,
  YEAR: 3,
} as const;

export const DATE_TYPE_TEXTS = {
  [DATE_TYPE.DAY]: "Ngày",
  [DATE_TYPE.MONTH]: "Tháng",
  [DATE_TYPE.YEAR]: "Năm",
} as const;
