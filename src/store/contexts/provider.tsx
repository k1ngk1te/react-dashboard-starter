import React from 'react';

import { AlertProvider, AlertModalProvider, AuthProvider, ToastProvider } from '.';
import QueryProvider from './query-provider';
import { CheckAuth } from '../../layout/protections';

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AlertProvider>
      <AlertModalProvider>
        <ToastProvider>
          <AuthProvider>
            <QueryProvider>
              <CheckAuth>{children}</CheckAuth>
            </QueryProvider>
          </AuthProvider>
        </ToastProvider>
      </AlertModalProvider>
    </AlertProvider>
  );
}

export default Provider;
