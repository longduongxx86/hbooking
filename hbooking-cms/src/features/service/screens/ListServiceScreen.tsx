import PageTitle from "@/components/PageTitle";
import { Button } from "@/shared/components/ui/button";
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
import { EditIcon, HomeIcon, Trash2Icon } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { CommonReponse } from "@/types";
import AlertDialogCustom from "@/components/AlertDialogCustom";
import { useMemo, useState } from "react";
import { LIMIT_DEFAULT, RESPONSE_CODE } from "@/constants/constants";
import { toast } from "@/shared/components/ui/use-toast";
import { Service } from "../types";
import { SERVICE_PATHS } from "../constants";
import { useServiceDeleteMutation } from "../api/useServiceDeteleMutation";
import { formatter } from "@/utils/formatter";
import ModifyServiceModal, {
  schemaType,
} from "../components/ModifyServiceModal";
import { useServiceAddMutation } from "../api/useServiceAddMutation";
import { useServiceDetailMutation } from "../api/useServiceDetailMutation";
import { useServiceUpdateMutation } from "../api/useServiceUpdateMutation";
import { useLoading } from "@/store";
import { PaginationPage } from "@/components/PaginationPage";
import { useListSeviceQuery } from "../api/useListServicesQuery";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { Search } from "@/components/Search";

const ListServiceScreen = () => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);
  const [isOpenAddServiceModal, setIsOpenAddServiceModal] =
    useState<boolean>(false);
  const [serviceId, setServiceId] = useState<string>("");
  const [serviceDetail, setServiceDetail] = useState<Service | null>(null);
  const { searchParameters, onSearch } = useSearchParameters();

  const { data } = useListSeviceQuery();

  const services = useMemo(() => {
    return data?.data.data.services;
  }, [data]);

  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const serviceDeleteMUtation = useServiceDeleteMutation();
  const serviecAddMutation = useServiceAddMutation();
  const serviceDetailMutation = useServiceDetailMutation();
  const serviceUpdateMutation = useServiceUpdateMutation();

  const handleCloseModifyModal = () => {
    setIsOpenAddServiceModal(false);
    setServiceDetail(null);
  };

  const handleDeleteService = async () => {
    if (!serviceId) {
      return;
    }

    const response = await serviceDeleteMUtation.mutateAsync(serviceId);

    setIsLoading(false);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Xóa dịch thành công",
        });
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Xóa dịch thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }
    setIsOpenDeleteDialog(false);
    navigate(SERVICE_PATHS.SERVICES);
  };

  const handleAddService = async (values: schemaType) => {
    const title = serviceDetail ? "Cập nhật dịch vụ" : "Thêm dịch vụ";
    const response = serviceDetail
      ? await serviceUpdateMutation.mutateAsync({
          service_id: serviceDetail.service_id,
          ...values,
        })
      : await serviecAddMutation.mutateAsync(values);

    setIsLoading(false);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: `${title} thành công`,
        });
        handleCloseModifyModal();
        navigate(SERVICE_PATHS.SERVICES);
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: `${title} thất bại`,
          description: "Vui lòng thử lại",
        });
        break;
    }
  };

  const handleDetailService = async (serviceId: string) => {
    const response = await serviceDetailMutation.mutateAsync(serviceId);
    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        setServiceDetail(() => response.data.data.service);
        break;
      }
      default:
        toast({
          variant: "destructive",
          description: "Vui lòng thử lại",
        });
        break;
    }
    setIsOpenAddServiceModal(true);
  };

  const hasOtherData = useMemo(() => {
    if (services?.length && services?.length === LIMIT_DEFAULT) {
      return true;
    }
    return false;
  }, [services]);

  const handleSearch = (service_name: string) => {
    onSearch({ ...searchParameters, service_name });
  };

  return (
    <>
      <PageTitle icon={<HomeIcon />}>Danh sách dịch vụ</PageTitle>
      <Search
        placeholder="Nhập tên dịch vụ"
        onSearch={handleSearch}
        defaultValue={searchParameters.service_name}
      />
      <div className="float-right">
        <Button onClick={() => setIsOpenAddServiceModal(true)}>
          Thêm dịch vụ
        </Button>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead>Tên dịch vụ</TableHead>
            <TableHead>Giá dịch vụ</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services?.map((service) => (
            <TableRow key={service.service_id}>
              <TableCell className="font-medium">
                {service.service_name}
              </TableCell>
              <TableCell>{formatter.format(service.price)}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditIcon
                    onClick={() => handleDetailService(`${service.service_id}`)}
                    className="w-4 text-primary cursor-pointer"
                  />
                  <Trash2Icon
                    className="w-4 text-red-500 cursor-pointer"
                    onClick={() => {
                      setServiceId(`${service.service_id}`);
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
        title="Bạn có chắc chắn xóa thông tin dịch vụ?"
        isOpen={isOpenDeleteDialog}
        onSubmit={handleDeleteService}
        onCancel={() => setIsOpenDeleteDialog(false)}
      >
        <p>Tất cả thông tin về dịch vụ sẽ bị xóa bỏ hết hoàn toàn.</p>
      </AlertDialogCustom>
      {isOpenAddServiceModal && (
        <ModifyServiceModal
          isOpen={isOpenAddServiceModal}
          onClose={handleCloseModifyModal}
          onSubmit={handleAddService}
          service={serviceDetail}
        />
      )}
    </>
  );
};

export default ListServiceScreen;
