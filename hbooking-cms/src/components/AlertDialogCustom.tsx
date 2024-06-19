import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { memo } from "react";

type AlertDialogCustomProp = {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
};

const AlertDialogCustom = ({
  isOpen,
  title,
  children,
  onCancel,
  onSubmit,
}: AlertDialogCustomProp) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Đồng ý</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(AlertDialogCustom);
