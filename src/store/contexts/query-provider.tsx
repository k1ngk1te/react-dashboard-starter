import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useAuthContext } from './auth/context';
import { useToastContext } from './toast/context';
import { handleAllErrors } from '../../utils/errors';

function getErrorTitle(error: string | number): string {
  switch (error) {
    case 400:
      return 'Validation Error';
    case 401:
      return 'Not Authenticated';
    case 403:
      return 'Permission Denied';
    case 404:
      return 'Not Found';
    case 405:
      return 'Not Allowed';
    default:
      return 'Error';
  }
}

function QueryProvider({ children }: { children: React.ReactNode }) {
  const { open } = useToastContext();
  const { logout } = useAuthContext();

  // Create a client
  const queryClient = React.useMemo(() => {
    const client = new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          const err = handleAllErrors(error);
          const title = getErrorTitle(err.status);
          open({
            message: `${title}: ${err.message}`,
            type: 'error',
          });
          if (err.status === 401) logout();
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          const err = handleAllErrors(error);
          const title = getErrorTitle(err.status);
          open({
            message: `${title}: ${err.message}`,
            type: 'error',
          });
          if (err.status === 401) logout();
        },
      }),
      defaultOptions: {
        queries: {
          refetchOnMount: true,
          // refetchOnReconnect: false,
          refetchOnWindowFocus: false,
        },
      },
    });
    return client;
  }, [open, logout]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
