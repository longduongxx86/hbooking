import { date } from "@/utils/date";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface DatePickerWithRangeProp<T extends FieldValues, K extends keyof T> {
  // @ts-ignore
  field: ControllerRenderProps<T, K>;
  property: K;
}

export default function DatePickerWithRange<
  T extends FieldValues,
  K extends keyof T
>({ field, property }: DatePickerWithRangeProp<T, K>) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal")}
          >
            <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            <p
              className={cn(
                !field.value.from && !field.value.to && "text-muted-foreground"
              )}
            >
              {field.value.from ? (
                field.value.to ? (
                  <>
                    {date(field.value.from).format()} -{" "}
                    {date(field.value.to).format()}
                  </>
                ) : (
                  date(field.value.from).format()
                )
              ) : (
                <span>Ngày nhận phòng - Ngày trả phòng</span>
              )}
            </p>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pb-3" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={field.value}
            onSelect={field.onChange}
            numberOfMonths={2}
          ></Calendar>
          <div className="flex justify-center text-sm">
            {field.value.from
              ? date(field.value.from).format()
              : "Ngày nhận phòng"}{" "}
            -{" "}
            {field.value.to ? date(field.value.to).format() : "Ngày trả phòng"}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
