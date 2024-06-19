import PageTitle from "@/components/PageTitle";
import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHomestayDetailQuery } from "../api/useHomestayDetailQuery";
import { Homestay } from "../types";
import ModifyHomestay, { formType } from "../components/ModifyHomestay";
import { useHomestayUpdateMutation } from "../api/useHomestayUpdateMutation";
import { usePhotoUpdateMutation } from "@/features/auth/api/usePhotoUpdateMutation";
import { ENTITY_TYPE, RESPONSE_CODE } from "@/constants/constants";
import { toast } from "@/shared/components/ui/use-toast";
import { useAuthStore, useLoading } from "@/store";
import { HOMESTAY_PATHS } from "../constants";

const DetailHomestayScreen = () => {
  const { id } = useParams();
  const [homestay, setHomestay] = useState<Homestay>();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!id) {
    return <></>;
  }
  const { isSuccess, data } = useHomestayDetailQuery(id);

  useEffect(() => {
    if (isSuccess) {
      setHomestay(data.data.data.homestay);
    }
  }, [isSuccess]);

  const updatePhotoMutation = usePhotoUpdateMutation();
  const homestayUpdateMutation = useHomestayUpdateMutation();

  const handleSubmit = async (
    formData: formType,
    photos: File[] | [],
    removePhotos?: number[]
  ) => {
    const formDataPhotos = new FormData();
    if (photos.length) {
      photos.forEach((photo) => {
        formDataPhotos.append("photos", photo);
      });
    }
    formDataPhotos.append("entity_id", id);
    formDataPhotos.append("entity_type", `${ENTITY_TYPE.ENTITY_TYPE_HOMESTAY}`);
    if (removePhotos) {
      formDataPhotos.append("delete_photo_ids", `[${removePhotos}]`);
    }

    const data: Pick<
      Homestay,
      "name" | "ward" | "district" | "province" | "description" | "user_id"
    > = {
      user_id: Number(formData.user_id),
      name: formData.name,
      ward: Number(formData.ward),
      district: Number(formData.district),
      province: Number(formData.province),
      description: formData.description,
    };

    const response = await updatePhotoMutation
      .mutateAsync({ requestBody: formDataPhotos })
      .then(async () => {
        return await homestayUpdateMutation.mutateAsync({
          id,
          data,
        });
      });

    setIsLoading(false);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Chỉnh sửa Homestay thành công",
        });
        navigate(HOMESTAY_PATHS.HOMESTAY);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Chỉnh sửa Homestay thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }
  };

  return (
    <>
      <PageTitle icon={<EyeIcon />}>Chi tiết Homestay</PageTitle>
      {homestay && (
        <ModifyHomestay onSubmitEdit={handleSubmit} homestay={homestay} />
      )}
    </>
  );
};

export default DetailHomestayScreen;
