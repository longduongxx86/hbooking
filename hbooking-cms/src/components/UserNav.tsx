import { AUTH_PATHS } from "@/features/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAuthStore } from "@/store";
import { useNavigate } from "react-router-dom";
import ResetPasswordDialog from "../features/user/components/ResetPasswordDialog";
import { Dialog } from "@radix-ui/react-dialog";
import { useState } from "react";
import PersonalInformation from "../features/user/components/PersonalInformationDialog";

export function UserNav() {
  const [open, setOpen] = useState(false);
  const [showChangePassowordDialog, setShowChangePasswordDialog] =
    useState(false);
  const [showPersonalInformationDialog, setShowPersonalInformationDialog] =
    useState(false);
  const { removeAuthState, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthState();
    return navigate(AUTH_PATHS.LOG_IN);
  };

  return (
    <Dialog
      open={showChangePassowordDialog || showPersonalInformationDialog}
      onOpenChange={
        showChangePassowordDialog
          ? setShowChangePasswordDialog
          : setShowPersonalInformationDialog
      }
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-12 h-12 rounded-full">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar} alt={user?.user_name} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.user_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                setShowPersonalInformationDialog(true);
              }}
            >
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                setShowChangePasswordDialog(true);
              }}
            >
              Thay đổi mật khẩu
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showChangePassowordDialog && <ResetPasswordDialog />}
      {showPersonalInformationDialog && <PersonalInformation user={user} />}
    </Dialog>
  );
}
