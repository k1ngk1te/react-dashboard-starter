import type { LoginResponseType, LogoutResponseType } from '~/types';
import { BaseAuthRepository } from './base.repository';

export class ApiAuthRepository extends BaseAuthRepository {
  async getAuth(): Promise<LoginResponseType> {
    throw new Error('NOT_IMPLEMENTED');
  }

  async login(): Promise<LoginResponseType> {
    throw new Error('NOT_IMPLEMENTED');
  }

  async logout(): Promise<LogoutResponseType> {
    throw new Error('NOT_IMPLEMENTED');
  }

  // Implement when the external API supports refresh tokens.
  // async refreshAccessToken(refreshToken: string): Promise<{ token: string; refreshToken?: string }> {
  //   throw new Error('NOT_IMPLEMENTED');
  // }
}
