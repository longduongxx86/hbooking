export const AUTH_PATHS = {
  LOG_IN: "/login",
  REGISTER: "/register",
  PASSWORD_CHANGED: "/password-changed",
  FORGET_PASSWORD: "/forget-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export const AUTH_API_PATHS = {
  LOG_IN: "/user/login",
  REGISTER: "/user/register",
  FORGET_PASSWORD: "/user/forget-password",
  RESET_PASSWORD: "/user/reset-password",
  UPDATE_PHOTOS: "/photos",
} as const;
