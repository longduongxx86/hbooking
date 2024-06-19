import { Photo } from "@/types";

export type Homestay = {
  homestay_id: number;
  user_id: number;
  name: string;
  description: string;
  ward: number;
  district: number;
  province: number;
  photos: Photo[];
  created_at: number;
  updated_at: number;
};
