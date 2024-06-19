import Modal from "@/components/Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Service } from "../types";
import { memo } from "react";
import { useLoading } from "@/store";

export const schema = z.object({
  service_name: z
    .string()
    .trim()
    .min(1, { message: "Tên dịch vụ không được bỏ trống" }),
  price: z.coerce.number().int().gte(10000, {
    message: "Giá dịch vụ cần lớn hơn 10.000 VND",
  }),
  description: z.string().trim(),
});

export type schemaType = z.infer<typeof schema>;

type AddServiceModalProp = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: schemaType) => void;
  service: Service | null;
};

const ModifyServiceModal = ({
  onSubmit,
  onClose,
  service,
  ...props
}: AddServiceModalProp) => {
  const { setIsLoading } = useLoading();
  const form = useForm<schemaType>({
    defaultValues: {
      service_name: service?.service_name || "",
      price: service?.price || 0,
      description: service?.description || "",
    },
    resolver: zodResolver(schema),
  });

  const handleCloseModal = () => {
    onClose();
    form.reset();
  };

  const handleSubmitModal = (values: schemaType) => {
    setIsLoading(true);
    onSubmit(values);
    form.reset();
  };

  return (
    <Modal
      title="Thêm dịch vụ"
      onClose={handleCloseModal}
      onSubmit={form.handleSubmit(handleSubmitModal)}
      {...props}
    >
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="service_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên dịch vụ</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá dịch vụ</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default memo(ModifyServiceModal);
