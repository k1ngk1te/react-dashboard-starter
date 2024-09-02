import {
	createBrowserRouter,
	RouteObject,
	ScrollRestoration,
} from 'react-router-dom';

import * as pageRoutes from './config/page-routes';

import { Authenticated, NotAuthenticated } from './layout/protections';

import Home from './pages/index';

// Authentication
import Login from './pages/auth/login';
import ResetPassword from './pages/auth/password/reset';
import VerifyPassword from './pages/auth/password/verify';
import ConfirmPasswordReset from './pages/auth/password/confirm';
import PasswordResetSuccessful from './pages/auth/password/success';

import Register from './pages/auth/register';
import EmailVerification from './pages/auth/register/verify';
import EmailVerificationSuccess from './pages/auth/register/success';

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
			{
				path: pageRoutes.REGISTER_PAGE,
				element: <Register />,
			},
			{
				path: pageRoutes.EMAIL_VERIFY_PAGE,
				element: <EmailVerification />,
			},
			{
				path: pageRoutes.EMAIL_VERIFY_SUCCESS_PAGE,
				element: <EmailVerificationSuccess />,
			},
			// Login/Registration Related Pages Go Here
			{
				path: pageRoutes.LOGIN_PAGE,
				element: <Login />,
			},
			{
				path: pageRoutes.RESET_PASSWORD_PAGE,
				element: <ResetPassword />,
			},
			{
				path: pageRoutes.RESET_PASSWORD_VERIFY_PAGE,
				element: <VerifyPassword />,
			},
			{
				path: pageRoutes.RESET_PASSWORD_CONFIRM_PAGE,
				element: <ConfirmPasswordReset />,
			},
			{
				path: pageRoutes.RESET_PASSWORD_SUCCESS_PAGE,
				element: <PasswordResetSuccessful />,
			},
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
