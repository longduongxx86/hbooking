import PageTitle from "@/components/PageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddHomestayMutation } from "../api/useAddHomestayMutation";
import { useEffect } from "react";
import useAddressLocal from "@/hooks/useAddressLocal";
import { RESPONSE_CODE } from "@/constants/constants";
import { HOMESTAY_PATHS } from "../constants";
import { toast } from "@/shared/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ModifyHomestay from "../components/ModifyHomestay";
import { useAuthStore, useLoading } from "@/store";

const formSchema = z.object({
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

type formType = z.infer<typeof formSchema>;

const ModifyHomestayScreen = () => {
  const navigate = useNavigate();
  const { handleUpdateProvince, handleUpdateDistrict } = useAddressLocal();
  const { setIsLoading } = useLoading();
  const { user } = useAuthStore();

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      ward: "",
      district: "",
      province: "",
    },
  });

  const addHomestayMutation = useAddHomestayMutation();

  const handleSubmit = async (data: FormData, photos: File[] | []) => {
    const formData = data;
    formData.append("user_id", `${user.user_id}`);
    if (photos.length) {
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });
    }
    const response = await addHomestayMutation.mutateAsync({
      requestBody: formData,
    });

    setIsLoading(false);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Thêm Homestay thành công",
        });
        navigate(HOMESTAY_PATHS.HOMESTAY);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Thêm Homestay thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }
  };

  useEffect(() => {
    handleUpdateProvince(form.getValues("province"));
  }, [form.watch("province")]);

  useEffect(() => {
    handleUpdateDistrict(form.getValues("district"));
  }, [form.watch("district")]);

  return (
    <>
      <PageTitle icon={<PlusCircle />}>Thêm Homestay</PageTitle>
      <ModifyHomestay onSubmit={handleSubmit} />
    </>
  );
};

export default ModifyHomestayScreen;
