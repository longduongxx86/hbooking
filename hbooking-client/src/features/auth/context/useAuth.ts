import React from "react";
import { AuthContext } from "./authProvider";

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context not found");
  }
  return context;
};
