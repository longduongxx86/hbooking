import Header from "@/components/Header";
import { memo } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = memo(() => {
  return (
    <div>
      <Header />
      <div className="container mt-10 flex justify-center">
        <Outlet />
      </div>
    </div>
  );
});

export default AuthLayout;
