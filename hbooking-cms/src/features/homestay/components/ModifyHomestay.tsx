import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ChangeEvent, useEffect, useState } from "react";
import useAddressLocal from "@/hooks/useAddressLocal";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Homestay } from "../types";
import { useLoading } from "@/store";
import { useListUserQuery } from "@/features/user/api/useListUserQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/shared/components/ui/command";
import { CheckIcon } from "lucide-react";

const formSchema = z.object({
  user_id: z.string(),
  name: z.string().min(1, {
    message: "Tên Homestay không được để trống",
  }),
  description: z.string().min(1, {
    message: "Mô tả không được để trống",
  }),
  ward: z.string().min(1, {
    message: "Địa chỉ xã/phường không được để trống",
  }),
  district: z.string().min(1, {
    message: "Địa chỉ huyện/quận không được để trống",
  }),
  province: z.string().min(1, {
    message: "Địa chỉ tỉnh không được để trống",
  }),
});

export type formType = z.infer<typeof formSchema>;

type ModifyHomestayProp = {
  onSubmit?: (formData: FormData, photos: File[] | []) => void;
  onSubmitEdit?: (
    data: formType,
    photos: File[] | [],
    removePhotos: number[]
  ) => void;
  homestay?: Homestay;
};

const ModifyHomestay = ({
  onSubmit,
  homestay,
  onSubmitEdit,
}: ModifyHomestayProp) => {
  const {
    provinceLocal,
    districtLocal,
    wardLocal,
    handleUpdateProvince,
    handleUpdateDistrict,
  } = useAddressLocal();
  const [hasChanged, setHasChanged] = useState(false);
  const [photos, setPhotos] = useState<File[] | []>([]);
  const [removePhotos, setRemovePhotos] = useState<number[]>([]);
  const [photosPreview, setPhotosPreview] = useState<
    | {
        photo_id?: number;
        url: string;
      }[]
    | []
  >([]);

  const {
    data: listUser,
    isSuccess,
    refetch: listUserRefretch,
  } = useListUserQuery();

  const { setIsLoading, isLoading } = useLoading();

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: homestay?.name || "",
      description: homestay?.description || "",
      ward: `${homestay?.ward}` || "",
      district: `${homestay?.district}` || "",
      province: `${homestay?.province}` || "",
    },
  });

  const handleSubmit = async (values: formType) => {
    setIsLoading(true);

    if (homestay) {
      onSubmitEdit?.(values, photos, removePhotos);
    } else {
      const formData = new FormData();
      for (let key in Object(values)) {
        formData.append(key, Object(values)[key]);
      }
      onSubmit?.(formData, photos);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setPhotos(() => [...photos, files[0]]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotosPreview(() => [
          ...photosPreview,
          {
            url: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const triggerChangedValue = () => {
    if (hasChanged) return;
    setHasChanged(true);
  };

  const handleDeletePhoto = (index: number, photo_id?: number) => {
    if (!photo_id) {
      return;
    }

    setPhotosPreview((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setRemovePhotos(() => [...removePhotos, photo_id]);
    triggerChangedValue();
  };

  useEffect(() => {
    handleUpdateProvince(form.getValues("province"));
  }, [form.watch("province")]);

  useEffect(() => {
    handleUpdateDistrict(form.getValues("district"));
  }, [form.watch("district")]);

  useEffect(() => {
    setPhotosPreview(
      homestay?.photos?.map((photo) => ({
        photo_id: photo.photo_id,
        url: photo.url,
      })) || []
    );
  }, [homestay]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          onChange={triggerChangedValue}
          className="space-y-4"
        >
          <div className="flex gap-6 flex-wrap">
            {photosPreview &&
              photosPreview.map(({ url, photo_id }, index) => (
                <Avatar
                  key={index}
                  className="group w-[200px] h-[200px] rounded-sm m-0 relative"
                >
                  <AvatarImage src={url} alt="" />
                  <Button
                    type="button"
                    className="absolute w-8 h-8 right-1 top-1 transition opacity-0 duration-500 ease-in-out group-hover:opacity-100"
                    variant={"destructive"}
                    onClick={() => handleDeletePhoto(index, photo_id)}
                  >
                    X
                  </Button>
                </Avatar>
              ))}
            <FormLabel
              htmlFor="picture"
              className="w-[200px] h-[200px] flex justify-center items-center border rounded-md"
            >
              <PlusIcon />
            </FormLabel>
            <Input
              id="picture"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div>
            {listUser && (
              <div>
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tên khách hàng</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[250px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? listUser.data.data.users?.find(
                                    (user) => `${user.user_id}` === field.value
                                  )?.full_name
                                : "Chọn tên khách hàng"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Tìm khách hàng..."
                              className="h-9"
                            />
                            <CommandGroup>
                              {isSuccess &&
                                listUser?.data.data?.users.map((user) => (
                                  <div
                                    key={user.user_id}
                                    onClick={() => {
                                      form.setValue(
                                        "user_id",
                                        `${user.user_id}`
                                      );
                                      triggerChangedValue();
                                    }}
                                    className="cursor-pointer hover:bg-slate-100 transition-all duration-300  flex justify-center items-center py-2 rounded-lg px-1"
                                  >
                                    {user.full_name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        `${user.user_id}` === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </div>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên Homestay</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-between gap-10">
            {Array.isArray(provinceLocal) && (
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tỉnh</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinceLocal?.map(({ name, value }) => (
                          <SelectItem key={name} value={`${value}`}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {Array.isArray(districtLocal) && (
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Huyện/Quận</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn Huyện/Quận" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districtLocal.map(({ name, value }) => (
                          <SelectItem key={name} value={`${value}`}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {Array.isArray(wardLocal) && (
              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Xã/Phường</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn Xã/Phường" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wardLocal.map(({ name, value }) => (
                          <SelectItem key={name} value={`${value}`}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả Homestay</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="float-right"
            type="submit"
            disabled={isLoading || (homestay && !hasChanged)}
          >
            {homestay ? "Chỉnh sửa Homestay" : "Thêm Homestay"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ModifyHomestay;
