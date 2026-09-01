export const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
};

export const COMMON_ERRORS = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
};

export const CSRF_TOKEN_ERRORS = {
  CSRF_TOKEN_NOT_PROVIDED: 'CSRF TOKEN was not provided',
  CSRF_TOKEN_NOT_VALID: 'CSRF TOKEN is not valid',
  CSRF_TOKEN_NOT_FOUND: 'CSRF TOKEN not found in response headers',
  CSRF_TOKEN_REFRESH_FAILED: 'Unable to refresh CSRF token',
  CSRF_TOKEN_REQUIRED: 'CSRF TOKEN is required for this request',
};

export const DOCUMENT_ERRORS = {
  FETCH_DOCUMENT_ERROR: 'Error Getting Document',
  DOWNLOAD_DOCUMENT_ERROR: 'Error Downloading Document',
  VIEW_DOCUMENT_ERROR: 'Error Viewing Document',
};

export const LOGIN_ERRORS = {
  NOT_AUTHENTICATED: 'User is not authenticated',
  RESULT_NOT_ASSIGNED: 'Login result was not assigned',
};
