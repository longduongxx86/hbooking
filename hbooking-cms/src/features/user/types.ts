import { ROLE_TYPES } from "../auth";
import { GENDER } from "./constants";

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export type User = {
  user_id: number;
  user_name: string;
  email: string;
  phone_number: string;
  gender: Gender;
  full_name: string;
  avatar: string;
  is_verified: boolean;
  role: ROLE_TYPES;
  created_at: number;
  updated_at: number;
};
