import PageTitle from "@/components/PageTitle";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { EditIcon, HomeIcon, Trash2Icon } from "lucide-react";
import { generatePath, useNavigate } from "react-router-dom";
import { HOMESTAY_API_PATHS, HOMESTAY_PATHS } from "../constants";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import AlertDialogCustom from "@/components/AlertDialogCustom";
import { useMemo, useState } from "react";
import { useHomestayDeleteMutation } from "../api/useHomesayDeleteMutation";
import { LIMIT_DEFAULT, RESPONSE_CODE } from "@/constants/constants";
import { toast } from "@/shared/components/ui/use-toast";
import { useLoading } from "@/store";
import { useHomestayQuery } from "../api/useHomestayQuery";
import { getAddressText } from "@/hooks/useAddressLocal";
import { PaginationPage } from "@/components/PaginationPage";
import { Search } from "@/components/Search";
import { useSearchParameters } from "@/hooks/useSearchParameters";

const HomestayScreen = () => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);
  const [homestayId, setHomestatyId] = useState<string>("");
  const { setIsLoading } = useLoading();
  const { searchParameters, onSearch } = useSearchParameters();

  const { data } = useHomestayQuery();

  const homestays = useMemo(() => {
    return data?.data.data.homestays.map((homestay) => {
      const addressText = getAddressText(
        homestay.province,
        homestay.district,
        homestay.ward
      );

      return {
        ...homestay,
        ...addressText,
      };
    });
  }, [data]);

  const navigate = useNavigate();
  const handleRedirectToModifyHomestayScreen = () => {
    return navigate(HOMESTAY_PATHS.HOMESTAY_MODIFY);
  };

  const homestayDeleteMutation = useHomestayDeleteMutation();

  const handleRedirectToDetailHomestayScreen = (homestayId: string) => {
    return navigate(
      generatePath(HOMESTAY_PATHS.HOMESTAY_DETAIL, { id: homestayId })
    );
  };

  const handleDeleteHomestay = async () => {
    if (!homestayId) {
      return;
    }

    const response = await homestayDeleteMutation.mutateAsync(homestayId);

    setIsLoading(false);

    switch (response.data.code) {
      case RESPONSE_CODE.SUCCESS: {
        toast({
          variant: "default",
          title: "Xóa Homestay thành công",
        });
        break;
      }
      default:
        toast({
          variant: "destructive",
          title: "Xóa Homestay thất bại",
          description: "Vui lòng thử lại",
        });
        break;
    }
    setIsOpenDeleteDialog(false);
    navigate(HOMESTAY_API_PATHS.HOMESTAYS);
  };

  const hasOtherData = useMemo(() => {
    if (homestays?.length && homestays?.length === LIMIT_DEFAULT) {
      return true;
    }
    return false;
  }, [homestays]);

  const handleSearch = (name: string) => {
    onSearch({ ...searchParameters, name });
  };

  return (
    <>
      <PageTitle icon={<HomeIcon />}>Danh sách Homestay</PageTitle>
      <Search
        placeholder="Nhập tên Homestay"
        onSearch={handleSearch}
        defaultValue={searchParameters.name}
      />
      <div className="float-right ">
        <Button onClick={handleRedirectToModifyHomestayScreen} variant="add">
          Thêm Homestay
        </Button>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>
            <TableHead>Tên Homestay</TableHead>
            <TableHead>Xã/Phường</TableHead>
            <TableHead>Huyện/Quận</TableHead>
            <TableHead>Tỉnh</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {homestays?.map((homestay, index) => (
            <TableRow
              key={homestay.name}
              className={index % 2 ? "bg-slate-50" : ""}
            >
              <TableCell className="p-2">
                {homestay.photos?.length ? (
                  <Avatar className="w-[100px] h-[100px] rounded-sm m-0">
                    <AvatarImage
                      src={homestay.photos?.[0].url || ""}
                      alt="Popular Image"
                    />
                  </Avatar>
                ) : (
                  <div className="w-[100px] h-[100px] rounded-sm m-0 flex justify-center items-center border opacity-50">
                    <HomeIcon className="w-24 h-24" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{homestay.name}</TableCell>
              <TableCell>{homestay?.wardText}</TableCell>
              <TableCell>{homestay?.districtText}</TableCell>
              <TableCell>{homestay?.provinceText}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditIcon
                    onClick={() =>
                      handleRedirectToDetailHomestayScreen(
                        `${homestay.homestay_id}`
                      )
                    }
                    className="w-4 text-primary cursor-pointer"
                  />
                  <Trash2Icon
                    className="w-4 text-red-500 cursor-pointer"
                    onClick={() => {
                      setHomestatyId(`${homestay.homestay_id}`);
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
        title="Bạn có chắc chắn xóa thông tin Homestay?"
        isOpen={isOpenDeleteDialog}
        onSubmit={handleDeleteHomestay}
        onCancel={() => setIsOpenDeleteDialog(false)}
      >
        <span>Tất cả thông tin về Homestay sẽ bị xóa bỏ hết hoàn toàn.</span>
      </AlertDialogCustom>
    </>
  );
};

export default HomestayScreen;
