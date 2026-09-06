import React from 'react';

import { NODE_ENV, RELOAD_NOTICE_DELAY, VERSION_CHECK_INTERVAL } from '~/config';
import { useAlertContext } from '~/store/contexts';
import { checkBuildVersion } from '~/utils/build-version';

/**
 * Detects when a newer production build has been deployed while this tab has been
 * sitting open, and refreshes the tab so it stops running a stale JS bundle.
 *
 * The check runs on mount, again whenever the tab becomes visible, and on an
 * interval while the tab stays open. On a mismatch it shows a brief notice via
 * the app's toast system, then calls `window.location.reload()` a couple of
 * seconds later so the notice is actually seen. Never reloads silently, never
 * reloads on a failed/ambiguous check.
 *
 * No-op outside production builds — dev has no `build-version.json`.
 */
export default function useAutoReloadOnDeploy(): void {
  const alert = useAlertContext();
  const alertRef = React.useRef(alert);
  alertRef.current = alert;

  React.useEffect(() => {
    if (NODE_ENV !== 'production') return;

    // Latches once a reload has been scheduled so nothing runs twice.
    let triggered = false;
    // Prevents overlapping checks (interval firing while a fetch is in flight).
    let running = false;

    const handleNewDeploy = () => {
      if (triggered) return;
      triggered = true;
      alertRef.current.info('Updating to the latest version...', { duration: 5 });
      window.setTimeout(() => window.location.reload(), RELOAD_NOTICE_DELAY);
    };

    const run = () => {
      if (triggered || running) return;
      running = true;
      void checkBuildVersion(handleNewDeploy).finally(() => {
        running = false;
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') run();
    };

    run();
    document.addEventListener('visibilitychange', onVisibilityChange);
    const intervalId = window.setInterval(run, VERSION_CHECK_INTERVAL);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, []);
}
