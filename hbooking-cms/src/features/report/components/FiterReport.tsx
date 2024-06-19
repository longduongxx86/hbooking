import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
} from "@/shared/components/ui/command";
import { CheckIcon } from "lucide-react";
import { useAuthStore } from "@/store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DATE_TYPE, ENTITY_BY } from "../constants";
import dayjs from "dayjs";
import { Button } from "@/shared/components/ui/button";
import DatePickerWithRange from "@/components/DataPickerWithRanger";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useHomestayQuery } from "@/features/homestay/api/useHomestayQuery";
import { useMemo } from "react";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import { useListUserQuery } from "@/features/user/api/useListUserQuery";
import { Checkbox } from "@/shared/components/ui/checkbox";

const MODES = [
  {
    value: DATE_TYPE.DAY,
    label: "Ngày",
  },
  {
    value: DATE_TYPE.MONTH,
    label: "Tháng",
  },
  {
    value: DATE_TYPE.YEAR,
    label: "Năm",
  },
];

const ENTITY_BYS = [
  {
    value: ENTITY_BY.USER,
    label: "Người dùng",
  },
  {
    value: ENTITY_BY.HOMESTAY,
    label: "Homestay",
  },
];

const schema = z.object({
  user_id: z.string(),
  homestay_id: z.array(z.string()),
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  mode: z.string(),
  by: z.string(),
});

type schemaType = z.infer<typeof schema>;

const FilterReport = () => {
  const { user } = useAuthStore();
  const { onSearch, searchParameters } = useSearchParameters();

  const currentYear = dayjs().year;

  const form = useForm<schemaType>({
    defaultValues: {
      user_id:
        (!searchParameters.homestay_id && searchParameters.user_id) ||
        (searchParameters.homestay_id ? "" : user.user_id?.toString()),
      homestay_id: searchParameters.homestay_id?.split(",") || [],
      date: {
        from: dayjs(searchParameters.from || `${currentYear}-01-01`).toDate(),
        to: dayjs(
          dayjs(searchParameters.to || undefined).format("YYYY-DD-MM")
        ).toDate(),
      },
      mode: searchParameters.mode || `${DATE_TYPE.YEAR}`,
      by: searchParameters.by || `${ENTITY_BY.USER}`,
    },
  });

  const { data: homestayData } = useHomestayQuery(false);
  const { data: userData, isSuccess } = useListUserQuery();

  const hasHomestayMode = useMemo(() => {
    if (form.getValues("by") === ENTITY_BY.HOMESTAY.toString()) {
      return true;
    }

    return false;
  }, [form.watch("by")]);

  const homestays = useMemo(() => {
    return homestayData?.data.data.homestays.map((homestay) => ({
      value: homestay.homestay_id,
      label: homestay.name,
    }));
  }, [homestayData]);

  const handleSubmit = (values: schemaType) => {
    const { user_is, homestay_id, ...searchParams } = searchParameters;
    const { date, ...props } = values;
    const from = dayjs(date.from).valueOf();
    const to = dayjs(date.to).valueOf();

    const user = (!hasHomestayMode && values.user_id) || "";
    const homestay = (hasHomestayMode && values.homestay_id) || [];

    onSearch({
      ...searchParams,
      ...props,
      from,
      to,
      user_id: user,
      homestay_id: homestay,
    });
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-wrap gap-8 items-end">
            <FormField
              control={form.control}
              name="by"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Chọn đối tượng</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={`${field.value}`}
                      className="flex flex-col"
                    >
                      {ENTITY_BYS?.map(({ value, label }) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={value}
                        >
                          <FormControl>
                            <RadioGroupItem value={`${value}`} />
                          </FormControl>
                          <FormLabel className="font-normal">{label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!hasHomestayMode && (
              <div>
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tên khách hàng</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[250px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? userData?.data.data?.users?.find(
                                    (user) =>
                                      `${user.user_id}` === `${field.value}`
                                  )?.full_name
                                : "Chọn tên khách hàng"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Tìm khách hàng..."
                              className="h-9"
                            />
                            <CommandGroup>
                              {isSuccess &&
                                userData?.data.data?.users.map((user) => (
                                  <div
                                    key={user.user_id}
                                    onClick={() => {
                                      form.setValue(
                                        "user_id",
                                        `${user.user_id}`
                                      );
                                    }}
                                    className="cursor-pointer hover:bg-slate-100 transition-all duration-300  flex justify-center items-center py-2 rounded-lg px-1"
                                  >
                                    {user.full_name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        `${user.user_id}` === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </div>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {hasHomestayMode && (
              <FormField
                control={form.control}
                name="homestay_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Chọn homestay</FormLabel>
                    {homestays?.map((item, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name="homestay_id"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={`${field.value}`}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    `${item.value}`
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          `${item.value}`,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== `${item.value}`
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Chọn theo ngày, tháng, năm</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MODES?.map(({ value, label }) => (
                        <SelectItem key={label} value={`${value}`}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex-[2] min-w-[250px] w-full">
                  <FormLabel>Check in - Check out</FormLabel>
                  <DatePickerWithRange<schemaType, "date">
                    field={field}
                    property="date"
                  />
                </FormItem>
              )}
            />
            <Button>Tìm kiếm</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FilterReport;
