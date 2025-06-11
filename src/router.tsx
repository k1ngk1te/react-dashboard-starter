import { createBrowserRouter, ScrollRestoration, Outlet, type RouteObject } from 'react-router-dom';

import * as pageRoutes from './config/routes';

// Authentication

// Onboarding and Registration

// Main
import DashboardPage from './pages';

// Others
import ErrorPage from './pages/error';
import NotFoundPage from './pages/404';

// Protections
import CheckAuth from './layout/protections/check-auth'
import Authenticated from './layout/protections/authenticated';
import NotAuthenticated from './layout/protections/unauthenticated';


const routes: RouteObject[] = [
  {
    element: (
      <>
        <CheckAuth><Outlet /></CheckAuth>
        <ScrollRestoration />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        element: <NotAuthenticated><Outlet /></NotAuthenticated>,
        children: [
          // Authentication Not Required
          // Onboarding and Registration
        ],
      },
      {
        element: <Authenticated><Outlet /></Authenticated>,
        children: [
          {
            path: pageRoutes.DASHBOARD_PAGE,
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
