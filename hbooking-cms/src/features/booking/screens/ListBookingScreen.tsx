import PageTitle from "@/components/PageTitle";
import { Button } from "@/shared/components/ui/button";
import { EditIcon, ListOrdered, Trash2Icon } from "lucide-react";
import { generatePath, useLoaderData, useNavigate } from "react-router-dom";
import { BOOKING_PATHS, BOOKING_TYPE_TEXT } from "../constants";
import { CommonReponse } from "@/types";
import { Booking } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import AlertDialogCustom from "@/components/AlertDialogCustom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useMemo, useState } from "react";
import { formatter } from "@/utils/formatter";
import { useDeleteBookingMutation } from "../api/useDeleteBookingMutation";
import { LIMIT_DEFAULT, RESPONSE_CODE } from "@/constants/constants";
import { toast } from "@/shared/components/ui/use-toast";
import { useLoading } from "@/store";
import dayjs from "dayjs";
import { Badge } from "@/shared/components/ui/badge";
import { useListBookingQuery } from "../api/useListBookingQuery";
import { PaginationPage } from "@/components/PaginationPage";

const ListBookingScreen = () => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const { data } = useListBookingQuery();
  const bookings = useMemo(() => {
    return data?.data.data.bookings;
  }, [data]);

  const deleteBooking = useDeleteBookingMutation();

  const redirectToAddRoomScreen = () => {
    return navigate(BOOKING_PATHS.ADD_BOOKING);
  };

  const redirectToDetailScreen = (bookingId: string) => {
    return navigate(
      generatePath(BOOKING_PATHS.DETAIL_BOOKING, { id: bookingId })
    );
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await deleteBooking.mutateAsync(bookingId);
    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Xóa booking thành công",
        });
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Xóa booking thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }

    setIsLoading(false);
    setIsOpenDeleteDialog(false);
    navigate(BOOKING_PATHS.BOOKING);
  };

  const hasOtherData = useMemo(() => {
    if (bookings?.length && bookings?.length === LIMIT_DEFAULT) {
      return true;
    }
    return false;
  }, [bookings]);

  return (
    <>
      <PageTitle icon={<ListOrdered />}>Danh sách đặt phòng</PageTitle>
      <div className="float-right">
        <Button onClick={redirectToAddRoomScreen}>Đặt phòng</Button>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Tên phòng</TableHead>
            <TableHead>Ngày nhận phòng</TableHead>
            <TableHead>Ngày trả phòng</TableHead>
            <TableHead>Tiền đặt cọc</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái phòng</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking, index) => (
            <TableRow
              key={booking.booking_id}
              className={index % 2 ? "bg-slate-50" : ""}
            >
              <TableCell className="font-medium">
                {booking.user.full_name}
              </TableCell>
              <TableCell className="font-medium">
                {booking.room.room_name}
              </TableCell>
              <TableCell>
                {dayjs(booking.check_in_date).format("DD-MM-YYYY")}
              </TableCell>
              <TableCell>
                {dayjs(booking.check_out_date).format("DD-MM-YYYY")}
              </TableCell>
              <TableCell>{formatter.format(booking.deposit_price)}</TableCell>
              <TableCell>{formatter.format(booking.total_price)}</TableCell>
              <TableCell>
                <Badge
                  variant={`${booking.status ? "default" : "destructive"}`}
                >
                  {BOOKING_TYPE_TEXT[booking.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditIcon
                    className="w-4 text-primary cursor-pointer"
                    onClick={() =>
                      redirectToDetailScreen(`${booking.booking_id}`)
                    }
                  />
                  <Trash2Icon
                    className="w-4 text-red-500 cursor-pointer"
                    onClick={() => {
                      setBookingId(`${booking.booking_id}`);
                      setIsOpenDeleteDialog(true);
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationPage hasOtherData={hasOtherData} />
      <AlertDialogCustom
        title="Bạn có chắc chắn xóa thông tin đặt phòng?"
        isOpen={isOpenDeleteDialog}
        onSubmit={handleDelete}
        onCancel={() => setIsOpenDeleteDialog(false)}
      >
        <p>Tất cả thông tin đặt phòng sẽ bị xóa bỏ hết hoàn toàn.</p>
      </AlertDialogCustom>
    </>
  );
};

export default ListBookingScreen;
