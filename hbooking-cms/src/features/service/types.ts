import { Photo } from "@/types";

export type Service = {
  service_id: number;
  service_name: string;
  description: string;
  price: number;
  photos: Photo[];
  created_at: number;
  updated_at: number;
};
