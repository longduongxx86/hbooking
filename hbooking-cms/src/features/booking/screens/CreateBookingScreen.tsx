import PageTitle from "@/components/PageTitle";
import ModifyBooking, { BookingFormType } from "../components/ModifyBooking";
import { ListOrdered } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Room } from "@/features/room/types";
import { CommonReponse } from "@/types";
import { ROOM_STATUS } from "@/features/room";
import { useAddBookingMutation } from "../api/useAddBookingMutation";
import dayjs from "dayjs";
import { Booking, BOOKING_PATHS } from "..";
import { toast } from "@/shared/components/ui/use-toast";
import { RESPONSE_CODE } from "@/constants/constants";
import { useLoading } from "@/store";

const CreateBookingScreen = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const {
    data: { rooms },
  } = useLoaderData() as {
    data: {
      rooms: Room[];
    };
  } & CommonReponse;

  const addBookingMutation = useAddBookingMutation();

  const listRoomAvailabel = rooms.filter(
    (room) => room.status === ROOM_STATUS.AVAILABLE
  );

  const handleSubmit = async (values: BookingFormType) => {
    const { total_price, deposit_price } = values;
    const data = {
      check_in_date: dayjs(values.date.from).valueOf(),
      check_out_date: dayjs(values.date.to).valueOf(),
      room_id: Number(values.room_id),
      status: Number(values.status),
      user_id: Number(values.user_id),
      total_price,
      deposit_price,
    } as Omit<Booking, "booking_id" | "user" | "room"> & {
      user_id: number;
      room_id: number;
    };

    const response = await addBookingMutation.mutateAsync(data);
    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Đặt phòng thành công",
        });
        navigate(BOOKING_PATHS.BOOKING);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Đặt phòng thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }

    setIsLoading(false);
  };

  return (
    <>
      <PageTitle icon={<ListOrdered />}>Đặt phòng</PageTitle>
      <ModifyBooking rooms={listRoomAvailabel} onSubmit={handleSubmit} />
    </>
  );
};

export default CreateBookingScreen;
