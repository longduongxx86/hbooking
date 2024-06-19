import Header from "@/components/Header";
import { useAuth } from "@/features/auth";
import { HOMESTAY_PATHS } from "@/features/homestay";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={HOMESTAY_PATHS.HOMESTAY} replace />;
  }

  return (
    <div>
      <Header />
      <div className="container mt-10 flex justify-center">
        <Outlet />
      </div>
      <div
        className={`absolute top-0 w-full h-full bg-black/60 z-10 ${
          isLoading ? "" : "hidden"
        }`}
      >
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
          <div
            className=" w-12 h-12 rounded-full animate-spin
          border-4 border-solid border-white border-t-transparent"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
