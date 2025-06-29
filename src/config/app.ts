export const APP_NAME = 'Kite React Dashboard Starter';

export const COMPANY_NAME = 'KITE';

export const DEFAULT_PAGINATION_SIZE = 100;

export const REFETCH_INTERVAL = 1000 * 60 * 1;

export const NODE_ENV = import.meta.env.NODE_ENV === 'development' ? 'development' : 'production';

export const TEST_MODE = import.meta.env.VITE_TEST_MODE
  ? !isNaN(+import.meta.env.VITE_TEST_MODE) && +import.meta.env.VITE_TEST_MODE === 1
  : false;

export const USER_DATA_KEY = 'user_data';
