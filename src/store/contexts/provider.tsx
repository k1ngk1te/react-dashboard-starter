import React from 'react';

import AlertProvider from './alert/provider';

import QueryProvider from './query-provider';

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AlertProvider>
      <QueryProvider>{children}</QueryProvider>
    </AlertProvider>
  );
}

export default Provider;
