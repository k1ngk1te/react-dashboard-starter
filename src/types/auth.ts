import type { ResponseType } from './base';

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
  sendToWhatsapp?: boolean;
};
export type LoginResponseType = ResponseType<{
  token: string;
  user: AuthDataType;
}>;

export type VerifyLoginRequestDataType = { otp: string };
export type VerifyLoginResponseDataType = ResponseType<AuthDataType>;

export type ResetPasswordRequestDataType = { email: string };

export type VerifyResetPasswordRequestDataType = { otp: string };

export type ConfirmResetPasswordRequestDataType = {
  password: string;
};
