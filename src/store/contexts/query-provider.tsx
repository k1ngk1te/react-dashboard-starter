import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useAuthContext } from './auth/context';
import { useAlertContext } from './alert/context';
import { handleAllErrors } from '../../utils/errors';

function QueryProvider({ children }: { children: React.ReactNode }) {
  const { open } = useAlertContext();
  const { logout } = useAuthContext();

  // Create a client
  const queryClient = React.useMemo(() => {
    const client = new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          const err = handleAllErrors(error);
          if (err.status !== 401)
            open({
              message: err.message,
              type: 'error',
            });
          if (err.status === 401) logout();
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          const err = handleAllErrors(error);
          if (err.status !== 401)
            open({
              message: err.message,
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
