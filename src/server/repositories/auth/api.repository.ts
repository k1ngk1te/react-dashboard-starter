import type { LoginResponseType, LogoutResponseType } from '~/types';
import { AppError } from '~/utils/errors';
import { COMMON_ERRORS, STATUS_CODES } from '~/utils/errors/constants';
import { BaseAuthRepository } from './base.repository';

export class ApiAuthRepository extends BaseAuthRepository {
  async getAuth(): Promise<LoginResponseType> {
    throw new AppError(STATUS_CODES.NOT_IMPLEMENTED, COMMON_ERRORS.NOT_IMPLEMENTED);
  }

  async login(): Promise<LoginResponseType> {
    throw new AppError(STATUS_CODES.NOT_IMPLEMENTED, COMMON_ERRORS.NOT_IMPLEMENTED);
  }

  async logout(): Promise<LogoutResponseType> {
    throw new AppError(STATUS_CODES.NOT_IMPLEMENTED, COMMON_ERRORS.NOT_IMPLEMENTED);
  }

  // Implement when the external API supports refresh tokens.
  async refreshAccessToken(_refreshToken: string): Promise<{ token: string; refreshToken?: string }> {
    throw new AppError(STATUS_CODES.NOT_IMPLEMENTED, COMMON_ERRORS.NOT_IMPLEMENTED);
  }
}
