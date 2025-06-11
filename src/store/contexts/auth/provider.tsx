import React from 'react';

import { AuthContext } from './context';
import type { AuthDataType } from '../../../types';

export type AuthContextType = AuthType & {
	login: (data: AuthDataType) => void;
	logout: () => void;
};

type AuthType = { data: AuthDataType | null; auth: boolean; loading: boolean };

function reducer(
	state: AuthType,
	action: { type: 'logout' } | { type: 'login'; payload: AuthDataType }
) {
	switch (action.type) {
		case 'login':
			return {
				auth: true,
				loading: false,
				data: action.payload,
			};
		case 'logout':
			return { auth: false, loading: false, data: state.data };
		default:
			return state;
	}
}

const initialState = {
	auth: false,
	data: null,
	loading: true,
};

const AuthProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [state, dispatch] = React.useReducer(reducer, initialState);

	const login = React.useCallback(
		(userData: AuthDataType) => {
			dispatch({
				type: 'login',
				payload: userData,
			});
		},
		[dispatch]
	);

	const logout = React.useCallback(() => {
		dispatch({
			type: 'logout',
		});
	}, [dispatch]);

	return (
		<AuthContext.Provider
			value={{
				auth: state.auth,
				data: state.data,
				loading: state.loading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
