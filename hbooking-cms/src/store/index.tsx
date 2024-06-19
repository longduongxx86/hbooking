import { MyUser, Session } from "@/features/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  user: MyUser;
  session: Session | null;
};

type Actions = {
  setUser: (user: MyUser) => void;
  setSession: (session: Session) => void;
  removeAuthState: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: {} as MyUser,
      session: null,
      setUser: (user) =>
        set(() => ({
          user,
        })),
      setSession: (session) =>
        set(() => ({
          session,
        })),
      removeAuthState: () =>
        set(() => ({
          user: undefined,
          session: null,
        })),
    }),
    {
      name: "global",
      getStorage: () => localStorage,
    }
  )
);

type LoadingState = {
  isLoading: boolean;
};

type LoadingActions = {
  setIsLoading: (isLoading: boolean) => void;
};

export const useLoading = create<LoadingState & LoadingActions>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) =>
    set(() => ({
      isLoading,
    })),
}));
