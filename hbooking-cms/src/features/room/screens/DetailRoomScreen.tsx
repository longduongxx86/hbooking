import PageTitle from "@/components/PageTitle";
import { PlusCircle } from "lucide-react";
import { ENTITY_TYPE, RESPONSE_CODE } from "@/constants/constants";
import { toast } from "@/shared/components/ui/use-toast";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import ModifyRoom from "../components/ModifyRoom";
import { ROOM_PATHS } from "../constants";
import { Homestay } from "@/features/homestay";
import { CommonReponse } from "@/types";
import { useEffect, useState } from "react";
import { useRoomDetailQuery } from "../api/useDetailRoomQuery";
import { Room, RoomStatus, RoomType } from "../types";
import { useRoomUpdateMutation } from "../api/useUpdateRoomMutaion";
import { usePhotoUpdateMutation } from "@/features/auth/api/usePhotoUpdateMutation";
import { formType } from "../components/ModifyRoom";
import { useLoading } from "@/store";

const DetailRoomScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [room, setRoom] = useState<Room>();

  const { setIsLoading } = useLoading();

  const { homestays } = useLoaderData() as {
    homestays: Homestay[];
  } & CommonReponse;

  if (!id) {
    return <></>;
  }

  const { isSuccess, data } = useRoomDetailQuery(id);

  useEffect(() => {
    if (isSuccess) {
      setRoom(data.data.data.room);
    }
  }, [isSuccess]);

  const useUpdatePhoto = usePhotoUpdateMutation();
  const updateRoomMutation = useRoomUpdateMutation();

  const handleSubmit = async (
    formData: formType,
    photos: File[] | [],
    removePhotos?: number[]
  ) => {
    const formDataPhotos = new FormData();
    if (photos.length) {
      photos?.forEach((photo) => {
        formDataPhotos.append("photos", photo);
      });
    }
    formDataPhotos.append("entity_id", id);
    formDataPhotos.append("entity_type", `${ENTITY_TYPE.ENTITY_TYPE_ROOM}`);

    if (removePhotos) {
      formDataPhotos.append("delete_photo_ids", `[${removePhotos}]`);
    }

    const data: Pick<
      Room,
      "homestay_id" | "room_name" | "price" | "status" | "room_type"
    > = {
      homestay_id: Number(formData.homestay_id),
      room_name: formData.room_name,
      price: Number(formData.price),
      status: Number(formData.status) as RoomStatus,
      room_type: Number(formData.room_type) as RoomType,
    };

    const response = await useUpdatePhoto
      .mutateAsync({ requestBody: formDataPhotos })
      .then(async () => {
        return await updateRoomMutation.mutateAsync({
          id,
          data,
        });
      });

    setIsLoading(false);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Cập nhật phòng thành công",
        });
        navigate(ROOM_PATHS.ROOMS);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Cập nhật phòng thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }
  };

  return (
    <>
      <PageTitle icon={<PlusCircle />}>Chi tiết phòng</PageTitle>
      {room && (
        <ModifyRoom
          onSubmitEdit={handleSubmit}
          homestays={homestays}
          room={room}
        />
      )}
    </>
  );
};

export default DetailRoomScreen;
