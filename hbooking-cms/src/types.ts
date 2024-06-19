import { ROLE_TYPES } from "./features/auth";

export type CommonReponse = {
  code: number;
  message: string;
};

export type Photo = {
  photo_id: number;
  entity_id: number;
  url: string;
  entity_type: ROLE_TYPES;
  created_at: number;
  updated_at: number;
};
