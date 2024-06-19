import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SearchProp = {
  onSearch?: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
};

const schema = z.object({
  searchStr: z.string(),
});

type schemaType = z.infer<typeof schema>;

export const Search = ({ onSearch, placeholder, defaultValue }: SearchProp) => {
  const form = useForm<schemaType>({
    defaultValues: {
      searchStr: defaultValue || "",
    },
  });

  const onSubmit = (value: schemaType) => {
    if (!value.searchStr && !defaultValue) {
      return;
    }

    onSearch?.(value.searchStr);
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-4 w-full mb-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="searchStr"
          render={({ field }) => (
            <FormItem className="flex-1 ">
              <FormControl>
                <Input placeholder={placeholder || "Tìm kiếm"} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button>Tìm kiếm</Button>
      </form>
    </Form>
  );
};
