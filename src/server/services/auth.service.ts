import { AuthRepository } from '../repositories/auth';

export const getAuth = AuthRepository.getAuth.bind(AuthRepository);
export const login = AuthRepository.login.bind(AuthRepository);
export const logout = AuthRepository.logout.bind(AuthRepository);
