import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { AUTH_API_PATHS, Session, TokenRefreshResponse } from "@/features/auth";
import { catchErrorCode } from "@/hooks/catchErrorCode";

export const api = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const refreshAuthLogic = () => {
  const session = JSON.parse(
    sessionStorage.getItem("session") ?? ""
  ) as Session;

  return api
    .post(AUTH_API_PATHS.REFRESH_TOKEN, {
      refresh_token: session.refresh_token,
    })
    .then((tokenRefreshResponse) => {
      const tokenRefreshResponseData =
        tokenRefreshResponse.data as TokenRefreshResponse;
      session.access_token = tokenRefreshResponseData.accessToken;
      session.refresh_token = tokenRefreshResponseData.refreshToken;

      return sessionStorage.setItem("session", JSON.stringify(session));
    })
    .catch(() => {
      throw undefined;
    });
};

createAuthRefreshInterceptor(api, refreshAuthLogic, {
  shouldRefresh: (axiosError) => {
    const errorCode = catchErrorCode(axiosError);
    return !!errorCode;
  },
});
