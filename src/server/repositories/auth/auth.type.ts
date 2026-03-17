import type { LoginRequestDataType, LoginResponseType, LogoutResponseType } from '~/types';

export interface IAuthRepository {
  getAuth(): Promise<LoginResponseType>;
  login(params: { csrfToken?: string | null; data: LoginRequestDataType }): Promise<LoginResponseType>;
  logout(params: { csrfToken?: string | null; token: string }): Promise<LogoutResponseType>;
  refreshUrl?: string;
  refreshAccessToken?(refreshToken: string): Promise<{ token: string; refreshToken?: string }>;
}
