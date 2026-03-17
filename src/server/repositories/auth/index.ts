import { USE_MOCK } from '../../config';
import { ApiAuthRepository } from './api.repository';
import { MockAuthRepository } from './mock.repository';
import authStore from '~/store/listeners/auth';
import type { IAuthRepository } from './auth.type';

export const AuthRepository: IAuthRepository = USE_MOCK ? new MockAuthRepository() : new ApiAuthRepository();

if (AuthRepository.refreshAccessToken && AuthRepository.refreshUrl) {
  authStore.setRefreshHandler(
    AuthRepository.refreshAccessToken.bind(AuthRepository),
    AuthRepository.refreshUrl,
  );
}
