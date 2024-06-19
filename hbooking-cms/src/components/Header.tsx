import { Link } from "react-router-dom";
import { UserNav } from "./UserNav";
import { useAuthStore } from "@/store";

const Header = () => {
  const { user } = useAuthStore();

  const hasUser = !!user?.user_id;

  return (
    <div
      className={`border-b ${
        hasUser ? "text-primary" : "bg-primary text-white"
      }`}
    >
      <div
        className={`${
          !hasUser && "justify-center"
        } flex h-14 items-center px-4`}
      >
        <div className="text-2xl font-bold tracking-tight">
          {!hasUser && <Link to="/">MH</Link>}
        </div>
        {hasUser && (
          <div className="flex items-center ml-auto space-x-4">
            <UserNav />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
