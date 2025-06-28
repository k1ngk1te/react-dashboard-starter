import type { LoginRequestDataType, LoginResponseType, ResponseType } from '~/types';
import HttpInstance from '~/utils/http';
import * as AuthSerializer from '../serializers/auth.serializer';
import { saveCredentials } from '../utils/auth';
import { NewSuccessDataResponse, NewSuccessResponse } from '../utils/response';

export async function getAuth(): Promise<LoginResponseType> {
  const response = await HttpInstance.current()
    .get('/api/auth/user')
    .then((response) => response.data);

  return NewSuccessDataResponse(response.data, response.message);
}

export async function login({ data }: { data: LoginRequestDataType }): Promise<LoginResponseType> {
  const credentials = AuthSerializer.serializeLogin({
    token: 'token',
    data: {
      ...data,
      id: 1,
      firstname: 'Adam',
      middlename: 'Garden',
      lastname: 'Eve',
      fullname: 'Adam Garden Eve',
      phone: '08123456789',
      photo: null,
      gender: 'male',
    },
    duration: 48,
    success: true,
    message: 'Logged in',
  });

  // Save credentials to the express server side cookies
  await saveCredentials(credentials);

  return NewSuccessDataResponse(credentials);
}

export async function logout({ token }: { token: string }): Promise<ResponseType> {
  const response = await HttpInstance.login(token)
    .post<ResponseType>('/api/auth/logout/', {})
    .then((response) => response.data);

  return NewSuccessResponse(response.message);
}
