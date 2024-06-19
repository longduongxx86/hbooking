import { createContext, ReactNode, useContext } from "react";
import { MyUser, Session } from "..";
import { useAuthStore, useLoading } from "@/store";

type AuthContextValue = {
  user?: MyUser;
  isAuthenticated: boolean;
  session: Session | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  isAuthenticated: false,
  session: null,
  isLoading: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Need to provide authentication");
  }

  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session } = useAuthStore();
  const { isLoading } = useLoading();

  const isAuthenticated = !!session;

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    session,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
