export const USER_PATHS = {
  RESET_PASSWORD: "/reset-password",
} as const;

export const USER_API_PATHS = {
  RESET_PASSWORD: "/user/reset-password",
  MY_USER: (userId: number | string) => `/user/${userId}` as "/user/:userId",
  LIST_USER: "/user",
} as const;

export const ROLES = {
  ADMIN: 1,
} as const;

export const GENDER = {
  MALE: 1,
  FEMALE: 2,
  OTHER: 4,
} as const;

export const GENDER_TEXT = {
  [GENDER.FEMALE]: "Nữ",
  [GENDER.MALE]: "Nam",
  [GENDER.OTHER]: "Khác",
} as const;
