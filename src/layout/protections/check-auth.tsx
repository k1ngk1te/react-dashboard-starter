import React from 'react';

import { useAuthContext } from '../../store/contexts';
import { useGetAuthQuery } from '../../store/queries/auth';
import { SplashScreen } from '../../utils/components';

const CheckAuth = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = React.useState(true);

	const { login, logout } = useAuthContext();

	const { data: response, status, isLoading } = useGetAuthQuery();

	React.useEffect(() => {
		if (!isLoading && status !== 'pending') {
			if (status === 'success' && response?.data) {
				login(response.data);
			} else logout();
			setLoading(false);
		}
	}, [login, logout, response, status, isLoading]);

	return loading ? <SplashScreen /> : children;
};

export default CheckAuth;
