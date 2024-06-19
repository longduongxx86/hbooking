export const ROOM_PATHS = {
  ROOMS: "/room",
  CREATE: "/room/create",
  DETAIL: "/room/:id",
};

export const ROOM_API_PATHS = {
  ROOM: "/room",
  DELETE: (roomId: string | number) => `/room/${roomId}` as "/room/:roomId",
  UPDATE: (roomId: string | number) => `/room/${roomId}` as "/room/:roomId",
  DETAIL: (roomId: string | number) => `/room/${roomId}` as "/room/:roomId",
};

export const ROOM_TYPE = {
  SINGLE: 1,
  DOUBLE: 2,
} as const;

export const ROOM_TYPE_TEXT = {
  [ROOM_TYPE.SINGLE]: "Phòng đơn",
  [ROOM_TYPE.DOUBLE]: "Phòng đôi",
} as const;

export const ROOM_STATUS = {
  AVAILABLE: 0,
  UNAVAILABLE: 1,
} as const;

export const ROOM_STATUS_TEXT = {
  [ROOM_STATUS.AVAILABLE]: "Còn trống",
  [ROOM_STATUS.UNAVAILABLE]: "Đã được đặt",
};
