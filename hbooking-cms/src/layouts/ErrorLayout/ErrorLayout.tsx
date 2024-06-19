import { AUTH_PATHS } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { CloudOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full justify-center h-screen items-center">
      <div className="text-center">
        <div className="flex justify-center">
          <CloudOff className="w-60 h-60 text-red-500" />
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold">Oops!</p>
          <p>Error 404 - Page Not Found</p>
          <Button className="mt-10" onClick={() => navigate(AUTH_PATHS.LOG_IN)}>
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}
