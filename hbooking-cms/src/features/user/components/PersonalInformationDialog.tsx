import { RESPONSE_CODE } from "@/constants/constants";
import { MyUser } from "@/features/auth";
import { useUpdateUserInformationMutation } from "@/features/user/api/useUpdateUserInformationMutation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
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
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAuthStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GENDER, GENDER_TEXT } from "../constants";

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

const schema = z.object({
  full_name: z.string(),
  gender: z.string(),
  phone_number: z.string(),
});

type PersonalInformationProps = {
  user: MyUser;
};

const PersonalInformation = ({ user }: PersonalInformationProps) => {
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const { setUser } = useAuthStore();
  const [avatar, setAvatar] = useState<File | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user.full_name ?? "",
      gender: `${user.gender}` ?? "",
      phone_number: user.phone_number ?? "",
    },
  });

  const updateUserInformation = useUpdateUserInformationMutation();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAvatar(event.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append("phone_number", values.phone_number);
    formData.append("gender", values.gender);
    formData.append("full_name", values.full_name);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response = await updateUserInformation.mutateAsync({
      id: user.user_id,
      request: formData,
    });

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Thay đổi thông tin cá nhân thành công",
        });
        setUser(response.data.data.user);
        setIsEdit(false);
        form.reset();
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Thay đổi thông tin cá nhân không thành công",
          description: "Vui lòng liên hệ với quản trị viên",
        });
        break;
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Thông tin cá nhân</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="">
            <Avatar className="w-[200px] h-[200px] m-auto rounded-sm">
              <AvatarImage src={user.avatar} alt={user?.user_name} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {isEdit && (
              <>
                <FormLabel htmlFor="picture">Upload Image</FormLabel>
                <Input id="picture" type="file" onChange={handleFileChange} />
              </>
            )}
          </div>
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  {isEdit ? (
                    <Input {...field} />
                  ) : (
                    <p className="text-lg font-bold">{user?.full_name}</p>
                  )}
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
                  {isEdit ? (
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex"
                      {...field}
                    >
                      {genders.map(({ value, text }) => (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={`${value}`} id={`${value}`} />
                          <Label htmlFor={`${value}`}>{text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-lg font-bold">
                      {GENDER_TEXT[user?.gender ?? GENDER.MALE]}
                    </p>
                  )}
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
                  {isEdit ? (
                    <Input {...field} />
                  ) : (
                    <p className="text-lg font-bold">{user?.phone_number}</p>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 w-full">
            {isEdit && (
              <Button type="submit" className="w-full">
                Thay đổi
              </Button>
            )}
          </div>
        </form>
      </Form>
      {!isEdit && (
        <Button type="button" onClick={() => setIsEdit(true)}>
          Cập thật thông tin
        </Button>
      )}
    </DialogContent>
  );
};

export default PersonalInformation;
