import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import tags from '../tags';
import { USER_DATA_KEY } from '../../config';
import { useLocalStorage } from '../../hooks';
import { AppError } from '../../utils/errors';

import type {
	AuthDataType,
	LoginRequestDataType,
	MutationOptionsType,
	ResponseType,
} from '../../types';

// ****** Queries ******

// get auth status
export function useGetAuthQuery() {
	const { value: userData } = useLocalStorage<AuthDataType>(USER_DATA_KEY, {
		initialValue: {
			email: 'test@gmail.com',
		},
		type: 'object',
	});

	const query = useQuery<ResponseType<AuthDataType>>({
		queryKey: [tags.Auth],
		async queryFn() {
			if (!userData) throw new AppError(401);

			return {
				status: 'success' as const,
				message: 'Fetched Auth Data',
				data: userData,
			};
		},
	});

	return query;
}

// ****** Mutations ******

// login
export function useLoginMutation(options: MutationOptionsType<AuthDataType>) {
	const { setValue: setUserData } = useLocalStorage<AuthDataType>(
		USER_DATA_KEY,
		{
			type: 'object',
		}
	);

	const mutation = useMutation({
		async mutationFn(form: Omit<LoginRequestDataType, 'deviceId'>) {
			const data = {
				...form,
			};
			setUserData(data);
			return {
				status: 'success' as const,
				message: 'Logged in successfully',
				data,
			};
		},
		onSuccess(response) {
			options.onSuccess(response);
		},
	});

	return mutation;
}

// logout
export function useLogoutMutation(options: MutationOptionsType) {
	const { value: userData } = useLocalStorage<AuthDataType>(USER_DATA_KEY, {
		type: 'object',
	});

	const queryClient = useQueryClient();
	const mutation = useMutation({
		async mutationFn() {
			if (!userData) throw new AppError(401);

			return {
				status: 'success' as const,
				message: 'Logged out successfully.',
			};
		},
		onSuccess(response) {
			queryClient.invalidateQueries({ queryKey: [tags.Auth] });
			queryClient.clear();
			options.onSuccess(response);
		},
	});

	return mutation;
}
