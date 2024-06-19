import { Photo } from "@/types";
import { ROOM_TYPE, ROOM_STATUS } from "./constants";
import { Homestay } from "../homestay";

export type RoomType = (typeof ROOM_TYPE)[keyof typeof ROOM_TYPE];
export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];

export type Room = {
  room_id: number;
  homestay_id?: number;
  homestay: Homestay;
  room_name: string;
  room_type: RoomType;
  photos: Photo[] | [];
  price: number;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
};
