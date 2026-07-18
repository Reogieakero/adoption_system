export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  RESCUE_PREVIEW_LIMIT: 3,
} as const;

export const SEARCH_DEBOUNCE_MS = 300;

export const SESSION_STORAGE_KEYS = {
  ADMIN_TOKEN: 'adminAuthToken',
  AUTH_TOKEN: 'authToken',
  THEME: 'pawconnect-theme',
} as const;
