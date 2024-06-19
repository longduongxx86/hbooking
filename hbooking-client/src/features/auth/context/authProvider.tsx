import { createContext, PropsWithChildren } from "react";
import { Session, MyUser } from "../types";

type AuthContextValue = {
  user?: MyUser;
  isAuthenticated: boolean;
  session: Session | null;
  setSession: (session: Session | null) => void;
  isSignedOutTemporarily: boolean;
  setIsSignedOutTemporarily: (_: boolean) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  isAuthenticated: false,
  session: null,
  setSession: () => {},
  isSignedOutTemporarily: false,
  setIsSignedOutTemporarily: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const authContextValue = {} as AuthContextValue;

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
