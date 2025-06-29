import type { LoginResponseType } from '~/types';
import type { ApiLoginResponseType } from '../types';

export function serializeLogin(csrfToken: string, input: ApiLoginResponseType): LoginResponseType['data'] {
  const data: LoginResponseType['data'] = {
    csrfToken,
    token: input.token,
    user: input.data,
  };
  return data;
}
