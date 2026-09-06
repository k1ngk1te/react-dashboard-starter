import React from 'react';

import useAutoReloadOnDeploy from '../../hooks/use-auto-reload-on-deploy';

import AlertProvider from './alert/provider';

import QueryProvider from './query-provider';

/** Runs the new-deploy watcher; needs to live inside AlertProvider for toasts. */
function AutoReloadOnDeploy() {
  useAutoReloadOnDeploy();
  return null;
}

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AlertProvider>
      <AutoReloadOnDeploy />
      <QueryProvider>{children}</QueryProvider>
    </AlertProvider>
  );
}

export default Provider;
