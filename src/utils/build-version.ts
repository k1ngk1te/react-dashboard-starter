import { BUILD_VERSION_STORAGE_KEY, BUILD_VERSION_URL } from '~/config';

type BuildVersionFile = {
  key: string;
  builtAt?: string;
};

function readStoredKey(): string | null {
  try {
    return localStorage.getItem(BUILD_VERSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredKey(key: string): void {
  try {
    localStorage.setItem(BUILD_VERSION_STORAGE_KEY, key);
  } catch {
    // Storage unavailable (private mode, quota, disabled) — nothing we can do.
  }
}

/**
 * Fetch the deployed build key. Any failure — network error, non-200, malformed
 * JSON, missing key — resolves to `null` ("no signal"), never throws. A flaky
 * network or a deploy caught mid-flight must not look like a version mismatch.
 */
async function fetchDeployedKey(): Promise<string | null> {
  try {
    const res = await fetch(BUILD_VERSION_URL, { cache: 'no-store' });
    if (!res.ok) return null;

    const data = (await res.json()) as Partial<BuildVersionFile>;
    return typeof data?.key === 'string' && data.key.length > 0 ? data.key : null;
  } catch {
    return null;
  }
}

/**
 * Compare the currently deployed build key against the one cached in
 * localStorage.
 *
 * - No signal (fetch failed) -> do nothing.
 * - No stored key yet (first check ever) -> just cache it, do nothing.
 * - Keys match -> do nothing.
 * - Keys differ -> cache the new key FIRST (so the reloaded tab doesn't
 *   immediately see a mismatch and loop), then invoke `onNewDeploy`.
 */
export async function checkBuildVersion(onNewDeploy: () => void): Promise<void> {
  const deployedKey = await fetchDeployedKey();
  if (!deployedKey) return;

  const storedKey = readStoredKey();

  if (storedKey === null) {
    writeStoredKey(deployedKey);
    return;
  }

  if (storedKey === deployedKey) return;

  writeStoredKey(deployedKey);
  onNewDeploy();
}
