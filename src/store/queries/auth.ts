import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUserContext } from '../contexts';
import tags from '../tags';
import * as AuthService from '../../server/services/auth.service';
import type { LoginRequestDataType, LoginResponseType, MutationOptionsType } from '../../types';

// ****** Queries ******

// get auth status
export function useGetAuthQuery({ initialData }: { initialData?: LoginResponseType }) {
  const query = useQuery<LoginResponseType>({
    queryKey: [tags.Auth],
    async queryFn() {
      return AuthService.getAuth();
    },
    initialData,
  });

  return query;
}

// ****** Mutations ******

// login
export function useLoginMutation(options: MutationOptionsType<LoginResponseType['data']>) {
  const mutation = useMutation({
    async mutationFn(data: LoginRequestDataType) {
      return AuthService.login({ data });
    },
    onSuccess(response) {
      options.onSuccess(response);
    },
  });

  return mutation;
}

// logout
export function useLogoutMutation(options: MutationOptionsType) {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const mutation = useMutation({
    async mutationFn() {
      return AuthService.logout({ token });
    },
    onSuccess(response) {
      queryClient.invalidateQueries({ queryKey: [tags.Auth] });
      queryClient.clear();
      options.onSuccess(response);
    },
  });

  return mutation;
}
