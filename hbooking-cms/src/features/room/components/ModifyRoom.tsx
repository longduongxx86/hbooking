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
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Room } from "../types";
import { ROOM_STATUS, ROOM_STATUS_TEXT, ROOM_TYPE } from "../constants";
import { Homestay } from "@/features/homestay";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { RoomTypeText } from "../screens/ListRoomScreen";
import { useLoading } from "@/store";

const formSchema = z.object({
  homestay_id: z.string().default(""),
  room_name: z.string().min(1, {
    message: "Tên Homestay không được để trống",
  }),
  price: z.coerce.number().gte(10000, {
    message: "Giá dịch vụ cần lớn hơn 10.000 VND",
  }),
  status: z.string().default(`${ROOM_TYPE.SINGLE}`),
  room_type: z.string().default(`${ROOM_STATUS.AVAILABLE}`),
});

export type formType = z.infer<typeof formSchema>;

type ModifyHomestayProp = {
  onSubmit?: (formData: FormData, photos: File[] | []) => void;
  onSubmitEdit?: (
    formData: formType,
    photos: File[] | [],
    removePhotos?: number[]
  ) => void;
  room?: Room;
  homestays?: Homestay[];
};

const ModifyRoom = ({
  onSubmit,
  onSubmitEdit,
  room,
  homestays,
}: ModifyHomestayProp) => {
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

  const { setIsLoading, isLoading } = useLoading();

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_name: room?.room_name || "",
      homestay_id: `${room?.homestay?.homestay_id || ""}`,
      price: room?.price || 0,
      status: `${room?.status || ROOM_STATUS.AVAILABLE}`,
      room_type: `${room?.room_type || ROOM_TYPE.SINGLE}`,
    },
  });

  const handleSubmit = async (values: formType) => {
    setIsLoading(true);

    if (room) {
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
    setPhotosPreview(
      room?.photos?.map((photo) => ({
        photo_id: photo.photo_id,
        url: photo.url,
      })) || []
    );
  }, [room]);

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
          onChange={triggerChangedValue}
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
          <FormField
            control={form.control}
            name="homestay_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Homestay</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tên Homestay" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {homestays?.map(({ name, homestay_id }) => (
                      <SelectItem key={name} value={`${homestay_id}`}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên phòng</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá phòng</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Trạng thái phòng</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={`${field.value}`}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={`${ROOM_STATUS.AVAILABLE}`} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {ROOM_STATUS_TEXT[ROOM_STATUS.AVAILABLE]}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value={`${ROOM_STATUS.UNAVAILABLE}`}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {ROOM_STATUS_TEXT[ROOM_STATUS.UNAVAILABLE]}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Chọn loại phòng</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={`${field.value}`}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={`${ROOM_TYPE.SINGLE}`} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          <RoomTypeText roomType={ROOM_TYPE.SINGLE} />
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={`${ROOM_TYPE.DOUBLE}`} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          <RoomTypeText roomType={ROOM_TYPE.DOUBLE} />
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="float-right"
            type="submit"
            disabled={isLoading || (room && !hasChanged)}
          >
            {room ? "Chỉnh sửa phòng" : "Thêm phòng"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ModifyRoom;
