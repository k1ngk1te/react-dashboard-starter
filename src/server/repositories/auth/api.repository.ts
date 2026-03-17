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
}
