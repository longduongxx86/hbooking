import { Session } from "@/features/auth";

export const LOCAL_STORAGE_KEY = "session";

export const setSession = (data: Session) => {
  sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const getSession = () => {
  sessionStorage.getItem(LOCAL_STORAGE_KEY);
};
