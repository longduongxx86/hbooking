import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { z } from "zod";
import { BOOKING_TYPE, BOOKING_TYPE_TEXT } from "../constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@/store";
import { Button } from "@/shared/components/ui/button";
import { Booking } from "../types";
import { useEffect, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Room } from "@/features/room/types";
import DatePickerWithRange from "@/components/DataPickerWithRanger";
import { useListUserQuery } from "@/features/user/api/useListUserQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
} from "@/shared/components/ui/command";
import { CheckIcon } from "lucide-react";
import dayjs from "dayjs";

const formScheme = z.object({
  user_id: z.string(),
  room_id: z.string().default(""),
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  deposit_price: z.coerce.number(),
  total_price: z.coerce.number(),
  status: z.string().default(`${BOOKING_TYPE.BOOKING_STATUS_UNPAID}`),
});

export type BookingFormType = z.infer<typeof formScheme>;

type ModifyBookingProps = {
  onSubmit?: (formData: BookingFormType) => Promise<void>;
  booking?: Booking;
  rooms: Room[];
};

const ModifyBooking = ({ rooms, booking, onSubmit }: ModifyBookingProps) => {
  const { data: listUser, isSuccess } = useListUserQuery();
  const [hasChanged, setHasChanged] = useState(false);
  const { setIsLoading, isLoading } = useLoading();

  const form = useForm<BookingFormType>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      user_id: `${booking?.user.user_id}` || "",
      room_id: `${booking?.room.room_id}` || "",
      date: {
        from: new Date(),
        to: new Date(),
      },
      deposit_price: booking?.deposit_price || 0,
      total_price: booking?.total_price || 0,
      status: `${booking?.status}` || `${BOOKING_TYPE.BOOKING_STATUS_UNPAID}`,
    },
  });

  const handleSubmit = async (values: BookingFormType) => {
    setIsLoading(true);
    onSubmit?.(values);
  };

  const triggerChangedValue = () => {
    if (hasChanged) return;
    setHasChanged(true);
  };

  useEffect(() => {
    const room = rooms.find(
      (room) => `${room.room_id}` === form.getValues("room_id")
    );
    form.setValue("deposit_price", (room?.price || 0) * 0.2);
  }, [form.watch("room_id")]);

  useEffect(() => {
    const room = rooms.find(
      (room) => `${room.room_id}` === form.getValues("room_id")
    );

    const date1 = dayjs(new Date(form.getValues("date.from")));
    const date2 = dayjs(new Date(form.getValues("date.to")));

    // Calculate the difference in days
    const differenceInDays = date2.diff(date1, "day");

    form.setValue("total_price", (room?.price ?? 0) * (differenceInDays + 2));
  }, [form, form.watch("room_id"), form.getValues("date"), rooms]);

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [isSuccess, setIsLoading]);

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
          onChange={triggerChangedValue}
        >
          <div className="flex gap-6 flex-wrap flex-col space-y-4">
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
            <div>
              <FormField
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Danh sách phòng</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms?.map(({ room_name, room_id }) => (
                          <SelectItem key={room_id} value={`${room_id}`}>
                            {room_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-[2] min-w-[250px] w-full">
                    <FormLabel>Check in - Check out</FormLabel>
                    <DatePickerWithRange<BookingFormType, "date">
                      field={field}
                      property="date"
                    />
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
                            <RadioGroupItem
                              value={`${BOOKING_TYPE.BOOKING_STATUS_UNPAID}`}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {
                              BOOKING_TYPE_TEXT[
                                BOOKING_TYPE.BOOKING_STATUS_UNPAID
                              ]
                            }
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={`${BOOKING_TYPE.BOOKING_STATUS_PAID}`}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {
                              BOOKING_TYPE_TEXT[
                                BOOKING_TYPE.BOOKING_STATUS_PAID
                              ]
                            }
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
                name="deposit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá đặt cọc</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100"
                        placeholder=""
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng giá tiền</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100"
                        placeholder=""
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            className="float-right"
            type="submit"
            disabled={isLoading || (booking && !hasChanged)}
          >
            {booking ? "Chỉnh đặt lịch" : "Tạo lịch đặt phòng"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ModifyBooking;
