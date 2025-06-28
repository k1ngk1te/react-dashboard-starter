import type { LoginResponseType } from '~/types';
import type { ApiLoginResponseType } from '../types';

export function serializeLogin(input: ApiLoginResponseType): LoginResponseType['data'] {
  const data: LoginResponseType['data'] = {
    token: input.token,
    user: input.data,
  };
  return data;
}
