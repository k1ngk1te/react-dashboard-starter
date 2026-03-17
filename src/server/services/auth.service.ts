import { AppError } from '~/utils/errors';
import authStore from '~/store/listeners/auth';
import { AuthRepository } from '../repositories/auth';
import type { LoginRequestDataType } from '~/types';

export const getAuth = AuthRepository.getAuth.bind(AuthRepository);

export function login(data: LoginRequestDataType) {
  const { csrfToken } = authStore.get();
  if (!csrfToken) throw new AppError(500, 'CSRF Token is required. Refresh the page and try again.');
  return AuthRepository.login({ csrfToken, data });
}

export function logout() {
  const { csrfToken, token } = authStore.get();
  if (!csrfToken || !token) throw new AppError(401, 'Not authenticated');
  return AuthRepository.logout({ csrfToken, token });
}
