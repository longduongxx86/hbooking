import PageTitle from "@/components/PageTitle";
import { PlusCircle } from "lucide-react";
import { RESPONSE_CODE } from "@/constants/constants";
import { toast } from "@/shared/components/ui/use-toast";
import { useLoaderData, useNavigate } from "react-router-dom";
import ModifyRoom from "../components/ModifyRoom";
import { ROOM_PATHS } from "../constants";
import { useAddRoomMutation } from "../api/useAddRoomMutation";
import { Homestay } from "@/features/homestay";
import { CommonReponse } from "@/types";
import { useLoading } from "@/store";

const CreateRoomScreen = () => {
  const { homestays } = useLoaderData() as {
    homestays: Homestay[];
  } & CommonReponse;

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const addRoomMutation = useAddRoomMutation();

  const handleSubmit = async (data: FormData, photos: File[] | []) => {
    const formData = data;
    if (photos.length) {
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });
    }
    const response = await addRoomMutation.mutateAsync({
      requestBody: formData,
    });

    setIsLoading(false);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Thêm phòng thành công",
        });
        navigate(ROOM_PATHS.ROOMS);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Thêm phòng thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }
  };

  return (
    <>
      <PageTitle icon={<PlusCircle />}>Thêm thông tin phòng</PageTitle>
      {homestays && (
        <ModifyRoom onSubmit={handleSubmit} homestays={homestays} />
      )}
    </>
  );
};

export default CreateRoomScreen;
