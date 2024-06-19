import { memo } from "react";

import Header from "@/components/Header";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_PATHS, useAuth } from "@/features/auth";

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={AUTH_PATHS.SIGN_IN} replace></Navigate>;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default memo(DefaultLayout);
