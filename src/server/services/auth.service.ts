import { DISABLE_CSRF } from '~/config';
import authStore from '~/store/listeners/auth';
import type { LoginRequestDataType } from '~/types';
import { AppError } from '~/utils/errors';
import { CSRF_TOKEN_ERRORS, LOGIN_ERRORS, STATUS_CODES } from '~/utils/errors/constants';
import { AuthRepository } from '../repositories/auth';

export const getAuth = AuthRepository.getAuth.bind(AuthRepository);

export function login(data: LoginRequestDataType) {
  const { csrfToken } = authStore.get();
  if (!csrfToken && !DISABLE_CSRF) throw new AppError(STATUS_CODES.BAD_REQUEST, CSRF_TOKEN_ERRORS.CSRF_TOKEN_REQUIRED);
  return AuthRepository.login({ csrfToken, data });
}

export function logout() {
  const { csrfToken, token } = authStore.get();
  if (!csrfToken || !token) throw new AppError(STATUS_CODES.UNAUTHORIZED, LOGIN_ERRORS.NOT_AUTHENTICATED);
  return AuthRepository.logout({ csrfToken, token });
}
