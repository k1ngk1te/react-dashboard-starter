import {
	createBrowserRouter,
	RouteObject,
	ScrollRestoration,
} from 'react-router-dom';

import * as pageRoutes from './config/page-routes';

import { Authenticated, NotAuthenticated } from './layout/protections';

import Home from './pages/index';

import ErrorPage from './utils/components/error-page';
// import SplashScreen from './utils/components/splash-screen';

const routes: RouteObject[] = [
	{
		path: '/auth/',
		element: (
			<>
				<NotAuthenticated />
				<ScrollRestoration />
			</>
		),
		errorElement: <ErrorPage />,
		children: [
			// Login/Registration Related Pages Go Here
		],
	},
	{
		path: '',
		element: (
			<>
				<Authenticated />
				<ScrollRestoration />
			</>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				path: pageRoutes.HOME_PAGE,
				element: <Home />,
			},
		],
	},
];

const router = createBrowserRouter(routes);

export default router;
