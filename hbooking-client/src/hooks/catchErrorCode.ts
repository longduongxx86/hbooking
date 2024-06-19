import axios from "axios";

export function catchErrorCode(error: unknown) {
  if (error && axios.isAxiosError(error)) {
    return error.response?.data?.errorCode || "";
  }
  return "";
}
