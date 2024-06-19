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
import { useRegisterMutation } from "../api";
import { RESPONSE_CODE } from "@/constants/constants";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useLoading } from "@/store";
import { toast } from "@/shared/components/ui/use-toast";
import { AUTH_PATHS } from "../constants";
import { GENDER, GENDER_TEXT } from "@/features/user";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";

const genders = [
  {
    value: GENDER.MALE,
    text: GENDER_TEXT[GENDER.MALE],
  },
  {
    value: GENDER.FEMALE,
    text: GENDER_TEXT[GENDER.FEMALE],
  },
  {
    value: GENDER.OTHER,
    text: GENDER_TEXT[GENDER.OTHER],
  },
];

const formSchema = z.object({
  user_name: z.string().min(1, {
    message: "Tài khoản không được để trống",
  }),
  full_name: z.string().min(1, {
    message: "Tên không được để trống",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu tối thiểu 6 ký tự",
  }),
  email: z.string().email({
    message: "Email không được bỏ trống",
  }),
  phone_number: z
    .string()
    .regex(/^\d+$/, {
      message: "Số điện thoại chỉ được chứa chữ số",
    })
    .min(10, {
      message: "Số điện thoại phải có ít nhất 10 chữ số",
    })
    .max(11, {
      message: "Số điện thoại không được vượt quá 11 chữ số",
    }),
  gender: z.string().default(`${GENDER.MALE}`),
});

const RegisterScreen = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const { setIsLoading } = useLoading();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
      phone_number: "",
      gender: `${GENDER.MALE}`,
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const response = await registerMutation.mutateAsync({
      ...values,
      gender: Number(values.gender),
    });

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Đăng ký tài khoản thành công, tiến hành đăng nhập",
        });
        navigate(AUTH_PATHS.LOG_IN);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Đăng ký tài khoản không thành công",
          description: "Vui lòng thử lại",
        });
        break;
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-[350px] w-full justify-center p-10 items-center">
      <h2 className="mb-8 text-3xl font-bold">Đăng ký tài khoản</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-2/3 max-w-[350px]"
        >
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và Tên</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex"
                    {...field}
                  >
                    {genders.map(({ value, text }) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={`${value}`} id={`${value}`} />
                        <Label htmlFor={`${value}`}>{text}</Label>
                      </div>
                    ))}
                  </RadioGroup>
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
            Đăng ký
          </Button>
        </form>
      </Form>
      <div className="mt-4">
        <Link
          to={AUTH_PATHS.LOG_IN}
          title="Đăng ký tài khoản"
          className="text-primary text-sm"
        >
          Bạn đã có tài khoản, tiến hành đăng nhập!
        </Link>
      </div>
    </div>
  );
};

export default memo(RegisterScreen);
