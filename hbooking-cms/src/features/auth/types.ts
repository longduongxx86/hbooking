import { ENTITY_TYPE } from "@/constants/constants";
import { Gender } from "../user/types";

export type Session = {
  token: string;
};

export type ROLE_TYPES = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE];

export type MyUser = {
  user_id: number;
  user_name: string;
  username?: string;
  email: string;
  phone_number: string;
  full_name: string;
  avatar: string;
  avatar_thumb: string;
  role: ROLE_TYPES;
  gender: Gender;
};

export type TokenRefreshResponse = {
  idToken: string;
  accessToken: string;
  expiresAt: string;
  refreshToken: string;
};

export type RegisterRequest = {
  user_name: string;
  full_name: string;
  password: string;
  email: string;
  phone_number: string;
  gender: number;
};

export type SignInRequest = {
  user_name: string;
  password: string;
};

export type SignInResponse = {
  user_name: string;
  password: string;
};

export type AuthResponse = {
  code: number;
  message: string;
  data: { user: MyUser; token: string };
};

export type ResponseBody = {
  code: number;
  message: string;
  data: { user: MyUser };
};
