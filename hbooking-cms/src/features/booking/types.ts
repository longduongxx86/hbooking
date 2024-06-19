import { Room } from "../room/types";
import { User } from "../user/types";
import { BOOKING_TYPE } from "./constants";
export type BookingStatus = (typeof BOOKING_TYPE)[keyof typeof BOOKING_TYPE];

export type Booking = {
  booking_id: number;
  user: User;
  room: Room;
  check_in_date: number; // Thời gian nhận phòng
  check_out_date: number; // Thời gian trả phòng
  deposit_price: number; // Tiền đặt cọc
  total_price: number;
  status: BookingStatus;
  created_at?: number;
  updated_at?: number;
};
