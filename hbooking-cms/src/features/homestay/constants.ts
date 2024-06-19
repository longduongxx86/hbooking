export const HOMESTAY_PATHS = {
  HOMESTAY: "/homestay",
  HOMESTAY_MODIFY: "/homestay/modify",
  HOMESTAY_DETAIL: "/homestay/:id",
} as const;

export const HOMESTAY_API_PATHS = {
  HOMESTAYS: "/homestay",
  HOMESTAY_DETAIL: (id: string) => `/homestay/${id}` as "/homestay/:id",
} as const;
