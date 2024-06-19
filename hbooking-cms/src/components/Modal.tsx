import { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type ModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  closeText?: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: () => void;
};

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  children,
  title,
  description,
  closeText = "Hủy bỏ",
  confirmText = "Xác nhận",
}: ModalProps) => {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">{children}</div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {closeText}
            </Button>
            <Button onClick={onSubmit}>{confirmText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Modal;
