import dayjs from "dayjs";
import vi from "dayjs/locale/vi";

export const date = (d: string | Date) => {
  const time = dayjs(d).locale("vi", vi);

  const format = (formatOption?: string) => {
    return time.format(formatOption ?? "ddd, DD MMMM");
  };

  return {
    format,
  };
};
