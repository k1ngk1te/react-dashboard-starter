import { CSRF_TOKEN, DISABLE_CSRF } from '~/config';
import authStore from '~/store/listeners/auth';
import type {
  AppResponseType,
  LoginRequestDataType,
  LoginResponseType,
  LogoutResponseType,
  ServerLoginResponseType,
} from '~/types';
import { AppError, handleAllErrors } from '~/utils/errors';
import { httpClient } from '~/utils/http';
import { API_GET_USER_URL, API_HEALTH_URL, API_LOGIN_URL, API_LOGOUT_URL } from '../../config/api-routes';
import { getResponseHeader, NewSuccessDataResponse } from '../../utils/response';
import type { IAuthRepository } from './auth.type';

export abstract class BaseAuthRepository implements IAuthRepository {
  abstract login(params: { csrfToken?: string | null; data: LoginRequestDataType }): Promise<LoginResponseType>;
  abstract logout(params: { csrfToken?: string | null; token: string }): Promise<LogoutResponseType>;
  abstract getAuth(): Promise<LoginResponseType>;

  protected async refreshCsrfToken(): Promise<string> {
    const response = await httpClient.get<AppResponseType>(API_HEALTH_URL);
    const newCsrfToken = getResponseHeader(response.headers, CSRF_TOKEN) || '';
    if (!newCsrfToken) throw new AppError(500, 'Unable to refresh CSRF token');
    authStore.set({ csrfToken: newCsrfToken });
    return newCsrfToken;
  }

  protected async getCredentials(): Promise<LoginResponseType> {
    const response = await httpClient.get<LoginResponseType>(API_GET_USER_URL);
    const responseData = response.data;

    let csrfToken = responseData.data.csrfToken;
    if (!csrfToken) csrfToken = getResponseHeader(response.headers, CSRF_TOKEN) || '';

    const BROWSER_REFRESHED_KEY = 'browser_refreshed';
    if (!csrfToken && !DISABLE_CSRF) {
      if (sessionStorage.getItem(BROWSER_REFRESHED_KEY)) {
        throw new AppError(400, 'CSRF TOKEN was not provided');
      }
      sessionStorage.setItem(BROWSER_REFRESHED_KEY, 'true');
      await this.refreshCsrfToken();
      return this.getCredentials();
    }

    sessionStorage.removeItem(BROWSER_REFRESHED_KEY);
    const result: LoginResponseType['data'] = { ...responseData.data, csrfToken };
    return NewSuccessDataResponse(result, responseData.message);
  }

  protected async saveCredentials(
    csrfToken: string | null | undefined,
    credentials: ServerLoginResponseType['data'],
  ): Promise<LoginResponseType> {
    const response = await httpClient.post<ServerLoginResponseType>(
      API_LOGIN_URL,
      { credentials },
      { headers: { [CSRF_TOKEN]: csrfToken ?? '' } },
    );

    const responseData = response.data;
    const newCsrfToken =
      typeof response.headers.get === 'function' ? response.headers.get(CSRF_TOKEN)?.toString() : undefined;

    const result: LoginResponseType['data'] = { ...credentials, csrfToken: newCsrfToken || csrfToken || '' };
    return NewSuccessDataResponse(result, responseData.message);
  }

  protected async removeCredentials({
    csrfToken,
    token,
  }: {
    csrfToken?: string | null;
    token: string;
  }): Promise<LogoutResponseType> {
    try {
      const response = await httpClient.post<AppResponseType>(
        API_LOGOUT_URL,
        {},
        { headers: { [CSRF_TOKEN]: csrfToken ?? '', Authorization: 'Bearer ' + token } },
      );
      const responseData = response.data;
      const newCsrfToken = getResponseHeader(response.headers, CSRF_TOKEN);
      const result: LogoutResponseType['data'] = { csrfToken: newCsrfToken };
      return NewSuccessDataResponse(result, responseData.message);
    } catch (err) {
      const error = handleAllErrors(err);
      if (error.errorCode === 'ERROR_CSRF_100') {
        const newCsrfToken = await this.refreshCsrfToken();
        return this.removeCredentials({ csrfToken: newCsrfToken, token });
      }
      throw err;
    }
  }
}
