import PageTitle from "@/components/PageTitle";
import { Button } from "@/shared/components/ui/button";
import { BedDouble, BedSingle, EditIcon, Trash2Icon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import AlertDialogCustom from "@/components/AlertDialogCustom";
import { Room, RoomType } from "../types";
import { useMemo, useState } from "react";
import {
  ROOM_PATHS,
  ROOM_STATUS_TEXT,
  ROOM_TYPE,
  ROOM_TYPE_TEXT,
} from "../constants";
import { Badge } from "@/shared/components/ui/badge";
import { formatter } from "@/utils/formatter";
import { CommonReponse } from "@/types";
import { generatePath, useLoaderData, useNavigate } from "react-router-dom";
import { useRoomDeleteMutation } from "../api/useDeleteRoomMutation";
import { LIMIT_DEFAULT, RESPONSE_CODE } from "@/constants/constants";
import { toast } from "@/shared/components/ui/use-toast";
import { useListRoomQuery } from "../api/useListRoomsQuery";
import { PaginationPage } from "@/components/PaginationPage";
import { Search } from "@/components/Search";
import { useSearchParameters } from "@/hooks/useSearchParameters";

type RoomTypeTextProp = {
  roomType: RoomType;
};

export const RoomTypeText = ({ roomType }: RoomTypeTextProp) => {
  return (
    <div className="flex gap-2 items-center">
      {roomType === ROOM_TYPE.SINGLE ? (
        <>
          {" "}
          <BedSingle />
          <p>{ROOM_TYPE_TEXT[roomType]}</p>
        </>
      ) : (
        <>
          {" "}
          <BedDouble />
          <p>{ROOM_TYPE_TEXT[roomType]}</p>
        </>
      )}
    </div>
  );
};

const ListRoomScreen = () => {
  const { data } = useListRoomQuery();
  const { searchParameters, onSearch } = useSearchParameters();

  const rooms = useMemo(() => {
    return data?.data.data.rooms;
  }, [data]);

  const [roomId, setRoomId] = useState("");
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();

  const deleteRoomMutation = useRoomDeleteMutation();
  const redirectToAddRoomScreen = () => {
    return navigate(ROOM_PATHS.CREATE);
  };

  const redirectToEditScreen = (roomId: string) => {
    return navigate(generatePath(ROOM_PATHS.DETAIL, { id: roomId }));
  };

  const handleDeleteRoom = async () => {
    const response = await deleteRoomMutation.mutateAsync(roomId);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Xóa phòng thành công",
        });
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Xóa phòng thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }

    setIsOpenDeleteDialog(false);
    navigate(ROOM_PATHS.ROOMS);
  };

  const hasOtherData = useMemo(() => {
    if (rooms?.length && rooms?.length === LIMIT_DEFAULT) {
      return true;
    }
    return false;
  }, [rooms]);

  const handleSearch = (room_name: string) => {
    console.log({ searchParameters });
    onSearch({ ...searchParameters, room_name: ["1", "2", "abc"] });
  };

  return (
    <>
      <PageTitle icon={<BedSingle />}>Danh sách phòng</PageTitle>
      <Search
        placeholder="Nhập tên phòng"
        onSearch={handleSearch}
        defaultValue={searchParameters.room_name}
      />
      <div className="float-right">
        <Button onClick={redirectToAddRoomScreen}>Thêm phòng</Button>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>
            <TableHead>Tên Phòng</TableHead>
            <TableHead>Tên Homestay</TableHead>
            <TableHead>Loại phòng</TableHead>
            <TableHead>Giá phòng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms?.map((room, index) => (
            <TableRow
              key={room.room_id}
              className={index % 2 ? "bg-slate-50" : ""}
            >
              <TableCell className="p-2">
                {room.photos?.length ? (
                  <Avatar className="w-[100px] h-[100px] rounded-sm m-0">
                    <AvatarImage
                      src={room.photos?.[0].url || ""}
                      alt="Popular Image"
                    />
                  </Avatar>
                ) : (
                  <div className="w-[100px] h-[100px] rounded-sm m-0 flex justify-center items-center border opacity-50">
                    <BedSingle className="w-24 h-24" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{room.room_name}</TableCell>
              <TableCell>{room.homestay.name}</TableCell>
              <TableCell>
                <RoomTypeText roomType={room.room_type} />
              </TableCell>
              <TableCell>{formatter.format(room.price)}</TableCell>
              <TableCell>
                <Badge variant={`${room.status ? "destructive" : "default"}`}>
                  {ROOM_STATUS_TEXT[room.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditIcon
                    onClick={() => redirectToEditScreen(`${room.room_id}`)}
                    className="w-4 text-primary cursor-pointer"
                  />
                  <Trash2Icon
                    className="w-4 text-red-500 cursor-pointer"
                    onClick={() => {
                      setRoomId(`${room.room_id}`);
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
      {isOpenDeleteDialog && (
        <AlertDialogCustom
          title="Bạn có chắc chắn xóa thông tin phòng?"
          isOpen={isOpenDeleteDialog}
          onSubmit={handleDeleteRoom}
          onCancel={() => setIsOpenDeleteDialog(false)}
        >
          <span>Tất cả thông tin về phòng sẽ bị xóa bỏ hết hoàn toàn.</span>
        </AlertDialogCustom>
      )}
    </>
  );
};

export default ListRoomScreen;
