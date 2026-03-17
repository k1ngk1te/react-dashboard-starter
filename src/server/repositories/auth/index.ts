import { USE_MOCK } from '../../config';
import { ApiAuthRepository } from './api.repository';
import { MockAuthRepository } from './mock.repository';

export const AuthRepository = USE_MOCK ? new MockAuthRepository() : new ApiAuthRepository();
