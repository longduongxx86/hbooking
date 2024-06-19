import { RESPONSE_CODE } from "@/constants/constants";
import { AUTH_PATHS } from "@/features/auth";
import { useResetPasswordMutation } from "@/features/user/api/useResetPasswordMutation";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAuthStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  user_name: z.string().min(8, {
    message: "Tài khoản không được để trông",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu tối thiểu 6 ký tự",
  }),
});

const ResetPasswordDialog = () => {
  const { toast } = useToast();
  const { removeAuthState } = useAuthStore();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });
  const resetPasswordMutation = useResetPasswordMutation();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const response = await resetPasswordMutation.mutateAsync(values);
    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Thay đổi mật khẩu thành công",
          description: "Vui lòng tiến hành đăng nhập lại",
        });
        removeAuthState();
        return navigate(AUTH_PATHS.LOG_IN);
      }
      default:
        toast({
          variant: "destructive",
          title: "Thay đổi mật khẩu không thành công",
          description: "Vui lòng liên hệ với quản trị viên",
        });
        break;
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Thay đổi mật khẩu</DialogTitle>
        <DialogDescription>
          Vui lòng cung cấp thông tin chính xác về tải khoản hiện tại
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="user_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tài khoản</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2">
            <Button type="submit">Thay đổi</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ResetPasswordDialog;
