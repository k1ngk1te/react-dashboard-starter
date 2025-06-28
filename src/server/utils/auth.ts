import type { LoginResponseType } from '~/types';
import HttpInstance from '~/utils/http';

export async function saveCredentials(credentials: LoginResponseType['data']) {
  const response = await HttpInstance.current()
    .post('/api/auth/login/', { credentials })
    .then((response) => response.data);
  const data = response.data;

  return {
    status: response.status,
    message: response.message,
    data,
  };
}
