import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as AuthService from '~/server/services/auth.service';
import type { LoginRequestDataType, LoginResponseType, LogoutResponseType, MutationOptionsType } from '~/types';

import tags from '../tags';

// ****** Queries ******

export function useGetAuthQuery({ initialData }: { initialData?: LoginResponseType }) {
  return useQuery<LoginResponseType>({
    queryKey: [tags.Auth],
    queryFn: AuthService.getAuth,
    initialData,
    retry: false,
  });
}

// ****** Mutations ******

export function useLoginMutation(options: MutationOptionsType<LoginResponseType['data']>) {
  return useMutation({
    mutationFn(data: LoginRequestDataType) {
      return AuthService.login(data);
    },
    onSuccess(response) {
      options.onSuccess(response);
    },
  });
}

export function useLogoutMutation(options: MutationOptionsType<LogoutResponseType['data']>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess(response) {
      queryClient.clear();
      options.onSuccess(response);
    },
  });
}
