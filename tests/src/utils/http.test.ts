import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// ─── Module mocks (must be hoisted before imports that use them) ───────────────

const mockAuthStore = {
  _state: {
    data: null as null | object,
    token: null as string | null,
    csrfToken: null as string | null,
    refreshToken: null as string | null,
    loading: false,
  },
  _refreshHandler: null as null | ((rt: string) => Promise<{ token: string; refreshToken?: string }>),
  _refreshUrl: null as string | null,
  get: vi.fn(function (this: typeof mockAuthStore) {
    return this._state;
  }),
  set: vi.fn(function (this: typeof mockAuthStore, payload: Partial<typeof mockAuthStore._state>) {
    this._state = { ...this._state, ...payload };
  }),
  subscribe: vi.fn(() => () => {}),
  setRefreshHandler: vi.fn(function (
    this: typeof mockAuthStore,
    handler: typeof mockAuthStore._refreshHandler,
    url?: string,
  ) {
    this._refreshHandler = handler;
    this._refreshUrl = url ?? null;
  }),
  getRefreshHandler: vi.fn(function (this: typeof mockAuthStore) {
    return this._refreshHandler;
  }),
  getRefreshUrl: vi.fn(function (this: typeof mockAuthStore) {
    return this._refreshUrl;
  }),
};

const mockAuthActions = {
  logout: vi.fn(),
  login: vi.fn(),
  changeCSRFToken: vi.fn(),
};

vi.mock('~/store/listeners/auth', () => ({ default: mockAuthStore }));
vi.mock('~/store/contexts/auth/context', () => ({ authActions: mockAuthActions }));
vi.mock('~/config/app', () => ({ CSRF_TOKEN: 'X-Csrf-Token', APP_NAME: 'Test' }));

// ─── Import HttpInstance after mocks are in place ─────────────────────────────

const { default: HttpInstance } = await import('../../../src/utils/http');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function make401Error(url = '/api/protected') {
  const err = new axios.AxiosError('Unauthorized');
  err.config = { url, headers: axios.defaults.headers as any };
  err.response = {
    status: 401,
    statusText: 'Unauthorized',
    data: { message: 'Unauthorized' },
    headers: {},
    config: err.config as any,
  };
  return err;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('HttpInstance interceptor', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(HttpInstance.current());
    vi.clearAllMocks();
    // Reset store state
    mockAuthStore._state = { data: null, token: 'access-token', csrfToken: 'csrf', refreshToken: null, loading: false };
    mockAuthStore._refreshHandler = null;
    mockAuthStore._refreshUrl = null;
    mockAuthStore.get.mockImplementation(function (this: typeof mockAuthStore) {
      return this._state;
    });
    mockAuthStore.getRefreshHandler.mockImplementation(function (this: typeof mockAuthStore) {
      return this._refreshHandler;
    });
    mockAuthStore.getRefreshUrl.mockImplementation(function (this: typeof mockAuthStore) {
      return this._refreshUrl;
    });
    mockAuthStore.set.mockImplementation(function (
      this: typeof mockAuthStore,
      payload: Partial<typeof mockAuthStore._state>,
    ) {
      this._state = { ...this._state, ...payload };
    });
  });

  afterEach(() => {
    mock.restore();
  });

  // ── No refresh token ────────────────────────────────────────────────────────

  it('logs out and rejects when there is no refresh token', async () => {
    mockAuthStore._state.refreshToken = null;
    mock.onGet('/api/protected').reply(401);

    await expect(HttpInstance.current().get('/api/protected')).rejects.toThrow();
    expect(mockAuthActions.logout).toHaveBeenCalledOnce();
  });

  it('logs out and rejects when there is no refresh handler', async () => {
    mockAuthStore._state.refreshToken = 'rt-123';
    mockAuthStore._refreshHandler = null;
    mock.onGet('/api/protected').reply(401);

    await expect(HttpInstance.current().get('/api/protected')).rejects.toThrow();
    expect(mockAuthActions.logout).toHaveBeenCalledOnce();
  });

  // ── Successful refresh ──────────────────────────────────────────────────────

  it('calls the refresh handler and retries the original request on 401', async () => {
    mockAuthStore._state.refreshToken = 'rt-123';
    const handler = vi.fn().mockResolvedValue({ token: 'new-access-token' });
    mockAuthStore._refreshHandler = handler;

    mock.onGet('/api/protected').replyOnce(401).onGet('/api/protected').reply(200, { data: 'ok' });

    const res = await HttpInstance.current().get('/api/protected');
    expect(handler).toHaveBeenCalledWith('rt-123');
    expect(mockAuthStore.set).toHaveBeenCalledWith(expect.objectContaining({ token: 'new-access-token' }));
    expect(res.data).toEqual({ data: 'ok' });
  });

  it('keeps the existing refresh token when the handler does not return a new one', async () => {
    mockAuthStore._state.refreshToken = 'rt-original';
    mockAuthStore._refreshHandler = vi.fn().mockResolvedValue({ token: 'new-token' });

    mock.onGet('/api/protected').replyOnce(401).onGet('/api/protected').reply(200, {});

    await HttpInstance.current().get('/api/protected');
    expect(mockAuthStore.set).toHaveBeenCalledWith(expect.objectContaining({ refreshToken: 'rt-original' }));
  });

  it('updates the refresh token when the handler returns a new one', async () => {
    mockAuthStore._state.refreshToken = 'rt-old';
    mockAuthStore._refreshHandler = vi.fn().mockResolvedValue({ token: 'new-token', refreshToken: 'rt-new' });

    mock.onGet('/api/protected').replyOnce(401).onGet('/api/protected').reply(200, {});

    await HttpInstance.current().get('/api/protected');
    expect(mockAuthStore.set).toHaveBeenCalledWith(expect.objectContaining({ refreshToken: 'rt-new' }));
  });

  // ── Failed refresh ──────────────────────────────────────────────────────────

  it('logs out and rejects when the refresh handler throws', async () => {
    mockAuthStore._state.refreshToken = 'rt-123';
    mockAuthStore._refreshHandler = vi.fn().mockRejectedValue(new Error('refresh failed'));

    mock.onGet('/api/protected').reply(401);

    await expect(HttpInstance.current().get('/api/protected')).rejects.toThrow();
    expect(mockAuthActions.logout).toHaveBeenCalledOnce();
  });

  // ── _retry guard ────────────────────────────────────────────────────────────

  it('does not attempt a second refresh if the retried request also returns 401', async () => {
    mockAuthStore._state.refreshToken = 'rt-123';
    const handler = vi.fn().mockResolvedValue({ token: 'new-token' });
    mockAuthStore._refreshHandler = handler;

    mock.onGet('/api/protected').reply(401);

    await expect(HttpInstance.current().get('/api/protected')).rejects.toThrow();
    expect(handler).toHaveBeenCalledOnce();
  });

  // ── Refresh URL guard ───────────────────────────────────────────────────────

  it('does not attempt refresh when the failing request is the refresh endpoint itself', async () => {
    mockAuthStore._state.refreshToken = 'rt-123';
    const handler = vi.fn().mockResolvedValue({ token: 'new-token' });
    mockAuthStore._refreshHandler = handler;
    mockAuthStore._refreshUrl = '/external/auth/refresh';

    mock.onPost('/external/auth/refresh').reply(401);

    await expect(HttpInstance.current().post('/external/auth/refresh')).rejects.toThrow();
    expect(handler).not.toHaveBeenCalled();
    expect(mockAuthActions.logout).toHaveBeenCalledOnce();
  });

  it('still refreshes when the URL does not match the refresh endpoint', async () => {
    mockAuthStore._state.refreshToken = 'rt-123';
    const handler = vi.fn().mockResolvedValue({ token: 'new-token' });
    mockAuthStore._refreshHandler = handler;
    mockAuthStore._refreshUrl = '/external/auth/refresh';

    mock.onGet('/api/protected').replyOnce(401).onGet('/api/protected').reply(200, {});

    await HttpInstance.current().get('/api/protected');
    expect(handler).toHaveBeenCalledOnce();
  });

  // ── Concurrent 401s ─────────────────────────────────────────────────────────

  it('queues concurrent 401 requests and resolves them all after a single refresh', async () => {
    mockAuthStore._state.refreshToken = 'rt-123';
    const handler = vi.fn().mockResolvedValue({ token: 'new-token' });
    mockAuthStore._refreshHandler = handler;

    mock.onGet('/api/a').replyOnce(401).onGet('/api/a').reply(200, { route: 'a' });
    mock.onGet('/api/b').replyOnce(401).onGet('/api/b').reply(200, { route: 'b' });

    const [a, b] = await Promise.all([HttpInstance.current().get('/api/a'), HttpInstance.current().get('/api/b')]);

    expect(handler).toHaveBeenCalledOnce();
    expect(a.data).toEqual({ route: 'a' });
    expect(b.data).toEqual({ route: 'b' });
  });

  // ── Non-401 errors ──────────────────────────────────────────────────────────

  it('does not intercept non-401 errors', async () => {
    mock.onGet('/api/protected').reply(500, { message: 'Server error' });

    await expect(HttpInstance.current().get('/api/protected')).rejects.toThrow();
    expect(mockAuthActions.logout).not.toHaveBeenCalled();
  });
});
