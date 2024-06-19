export const BOOKING_PATHS = {
  BOOKING: "/booking",
  ADD_BOOKING: "/booking/create",
  DETAIL_BOOKING: "/booking/:id",
};

export const BOOKING_API_PATHS = {
  BOOKING: "/booking",
  ADD_BOOKING: "/booking",
  GET_BOOKING: (bookingId: string | number) =>
    `/booking/${bookingId}` as "/booking/:bookingId",
  UPDATE_BOOKING: (bookingId: string | number) =>
    `/booking/${bookingId}` as "/booking/:bookingId",
  EDIT_BOOKING: (bookingId: string | number) =>
    `/booking/${bookingId}` as "/booking/:bookingId",
  DELETE_BOOKING: (bookingId: string | number) =>
    `/booking/${bookingId}` as "/booking/:bookingId",
};

export const BOOKING_TYPE = {
  BOOKING_STATUS_UNPAID: 0,
  BOOKING_STATUS_PAID: 1,
} as const;

export const BOOKING_TYPE_TEXT = {
  [BOOKING_TYPE.BOOKING_STATUS_UNPAID]: "Chưa thanh toán",
  [BOOKING_TYPE.BOOKING_STATUS_PAID]: "Đã thanh toán",
} as const;
