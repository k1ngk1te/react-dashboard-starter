import type { LoginRequestDataType, LoginResponseType, LogoutResponseType } from '~/types';

export interface IAuthRepository {
  getAuth(): Promise<LoginResponseType>;
  login(params: { csrfToken: string; data: LoginRequestDataType }): Promise<LoginResponseType>;
  logout(params: { csrfToken: string; token: string }): Promise<LogoutResponseType>;
}
