export type Session = {
  id_token: string;
  access_token: string;
  refresh_token: string;
};

export type MyUser = {
  username: string;
};

export type TokenRefreshResponse = {
  idToken: string;
  accessToken: string;
  expiresAt: string;
  refreshToken: string;
};
