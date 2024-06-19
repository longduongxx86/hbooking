import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { memo } from "react";
import { useSignInMutation } from "../api";
import { RESPONSE_CODE } from "@/constants/constants";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useLoading } from "@/store";
import { toast } from "@/shared/components/ui/use-toast";
import { HOMESTAY_PATHS } from "@/features/homestay";
import { AUTH_PATHS } from "../constants";
import { RootPath } from "@/routes";

const formSchema = z.object({
  user_name: z.string().min(1, {
    message: "Tài khoản không được để trống",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu tối thiểu 6 ký tự",
  }),
});

const LoginScreen = () => {
  const { setIsLoading } = useLoading();
  const { setSession, setUser } = useAuthStore();
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const response = await signInMutation.mutateAsync({
      user_name: values.user_name,
      password: values.password,
    });
    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        setSession({ token: response.data.data.token });
        setUser(response.data.data.user);
        toast({
          variant: "default",
          title: "Đăng nhập thành công",
        });
        navigate(RootPath);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Tài khoản đăng nhập không chính xác",
          description: "Vui lòng thử lại",
        });
        break;
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-[350px] w-full justify-center p-10 items-center">
      <h2 className="mb-8 text-3xl font-bold">Đăng nhập tài khoản</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-2/3 max-w-[350px]"
        >
          <FormField
            control={form.control}
            name="user_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản đăng nhập</FormLabel>
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
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>
      </Form>
      <div className="mt-4">
        <Link
          to={AUTH_PATHS.REGISTER}
          title="Đăng ký tài khoản"
          className="text-primary text-sm"
        >
          Bạn chưa có tài khoản, đăng ký tài khoản mới!
        </Link>
      </div>
    </div>
  );
};

export default memo(LoginScreen);
