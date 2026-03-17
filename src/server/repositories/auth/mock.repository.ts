import type { LoginRequestDataType, LoginResponseType, LogoutResponseType } from '~/types';

import { AppError, handleAllErrors } from '~/utils/errors';
import * as AuthSerializer from '../../serializers/auth.serializer';
import { NewSuccessDataResponse } from '../../utils/response';
import { BaseAuthRepository } from './base.repository';

export class MockAuthRepository extends BaseAuthRepository {
  async getAuth(): Promise<LoginResponseType> {
    return this.getCredentials();
  }

  async login({ csrfToken, data }: { csrfToken: string; data: LoginRequestDataType }): Promise<LoginResponseType> {
    const credentials = AuthSerializer.serializeLogin({
      token: 'token',
      data: {
        ...data,
        id: 1,
        firstname: 'Adam',
        middlename: 'Garden',
        lastname: 'Eve',
        fullname: 'Adam Garden Eve',
        phone: '08123456789',
        photo: null,
        gender: 'male',
      },
      duration: 48,
      success: true,
      message: 'Logged in',
    });

    let result: LoginResponseType | undefined = undefined;

    try {
      result = await this.saveCredentials(csrfToken, credentials);
    } catch (err) {
      const error = handleAllErrors(err);
      if (error.errorCode === 'ERROR_CSRF_100') {
        window.location.href = window.location.href.toString();
      } else {
        throw err;
      }
    }

    if (!result) throw new AppError(500, 'Unable to Sign In');

    return NewSuccessDataResponse(result.data);
  }

  async logout(params: { csrfToken: string; token: string }): Promise<LogoutResponseType> {
    return this.removeCredentials(params);
  }
}
