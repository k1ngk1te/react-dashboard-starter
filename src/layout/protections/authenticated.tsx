import React from 'react';
import { Outlet } from 'react-router-dom';

import Layout from '../index';
import { useAuthContext } from '../../store/contexts';
import Dynamic from '../../utils/components/dynamic';
import SplashScreen from '../../utils/components/splash-screen';

const Authenticated = () => {
	const { auth: isAuthenticated, loading: isLoading } = useAuthContext();

	if (isLoading === false && isAuthenticated)
		return (
			<Layout>
				<Outlet />
			</Layout>
		);

	if (isLoading === false && isAuthenticated === false)
		return (
			<Dynamic
				fallback={<SplashScreen />}
				component={React.lazy(() => import('../../containers/auth/login'))}
			/>
		);

	throw {
		title: 'Internal Server Error.',
		status: 500,
		message: 'An error occurred. Please try again later.',
	};
};

export default Authenticated;
