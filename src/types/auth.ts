import type { AppResponseType } from './base';

export type AuthDataType = {
  id: number;
  firstname: string;
  middlename: string | null;
  lastname: string;
  fullname: string;
  email: string;
  phone: string;
  photo: string | null;
  gender: string;
};

export type LoginRequestDataType = {
  email: string;
  password: string;
};
export type LoginResponseType = AppResponseType<{
  csrfToken: string;
  token: string;
  user: AuthDataType;
}>;
export type LogoutResponseType = AppResponseType<{
  csrfToken?: string;
}>;
export type ServerLoginResponseType = AppResponseType<{
  token: string;
  user: AuthDataType;
}>;

export type VerifyLoginRequestDataType = { otp: string };
export type VerifyLoginResponseDataType = AppResponseType<AuthDataType>;

export type ResetPasswordRequestDataType = { email: string };

export type VerifyResetPasswordRequestDataType = { otp: string };

export type ConfirmResetPasswordRequestDataType = {
  password: string;
};
