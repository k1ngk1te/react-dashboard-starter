// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('~/config', () => ({
  BUILD_VERSION_URL: '/build-version.json',
  BUILD_VERSION_STORAGE_KEY: 'test:build-version',
}));

const { checkBuildVersion } = await import('../../../src/utils/build-version');

const STORAGE_KEY = 'test:build-version';

function mockFetchJson(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  });
}

describe('checkBuildVersion', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches build-version.json with caching disabled', async () => {
    const fetchMock = mockFetchJson({ key: 'abc' });
    vi.stubGlobal('fetch', fetchMock);

    await checkBuildVersion(vi.fn());

    expect(fetchMock).toHaveBeenCalledWith('/build-version.json', { cache: 'no-store' });
  });

  it('stores the key and does nothing on the very first check', async () => {
    vi.stubGlobal('fetch', mockFetchJson({ key: 'first-key' }));
    const onNewDeploy = vi.fn();

    await checkBuildVersion(onNewDeploy);

    expect(localStorage.getItem(STORAGE_KEY)).toBe('first-key');
    expect(onNewDeploy).not.toHaveBeenCalled();
  });

  it('does nothing when the stored key matches', async () => {
    localStorage.setItem(STORAGE_KEY, 'same-key');
    vi.stubGlobal('fetch', mockFetchJson({ key: 'same-key' }));
    const onNewDeploy = vi.fn();

    await checkBuildVersion(onNewDeploy);

    expect(onNewDeploy).not.toHaveBeenCalled();
  });

  it('updates storage first, then triggers the callback, on a mismatch', async () => {
    localStorage.setItem(STORAGE_KEY, 'old-key');
    vi.stubGlobal('fetch', mockFetchJson({ key: 'new-key' }));

    const onNewDeploy = vi.fn(() => {
      // Storage must already hold the new key by the time we're called,
      // otherwise the reloaded tab would loop.
      expect(localStorage.getItem(STORAGE_KEY)).toBe('new-key');
    });

    await checkBuildVersion(onNewDeploy);

    expect(onNewDeploy).toHaveBeenCalledOnce();
  });

  it('ignores a network error (no signal, never a mismatch)', async () => {
    localStorage.setItem(STORAGE_KEY, 'old-key');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const onNewDeploy = vi.fn();

    await checkBuildVersion(onNewDeploy);

    expect(onNewDeploy).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('old-key');
  });

  it('ignores a non-200 response', async () => {
    localStorage.setItem(STORAGE_KEY, 'old-key');
    vi.stubGlobal('fetch', mockFetchJson({ key: 'new-key' }, false));
    const onNewDeploy = vi.fn();

    await checkBuildVersion(onNewDeploy);

    expect(onNewDeploy).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('old-key');
  });

  it('ignores malformed JSON', async () => {
    localStorage.setItem(STORAGE_KEY, 'old-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.reject(new SyntaxError('bad json')) }),
    );
    const onNewDeploy = vi.fn();

    await checkBuildVersion(onNewDeploy);

    expect(onNewDeploy).not.toHaveBeenCalled();
  });

  it('ignores a response with no key field', async () => {
    localStorage.setItem(STORAGE_KEY, 'old-key');
    vi.stubGlobal('fetch', mockFetchJson({ builtAt: '2026-09-06T00:00:00.000Z' }));
    const onNewDeploy = vi.fn();

    await checkBuildVersion(onNewDeploy);

    expect(onNewDeploy).not.toHaveBeenCalled();
  });
});
