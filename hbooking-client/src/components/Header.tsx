import { AUTH_PATHS } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">HBooking.com</Link>
        </span>
        <span className="flex space-x-2">
          <Link to={AUTH_PATHS.SIGN_IN} className="flex  items-center">
            <Button>Đăng nhập</Button>
          </Link>
          <Link to={AUTH_PATHS.SIGN_UP} className="flex items-center">
            <Button variant="outline">Đăng ký</Button>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Header;
