import { USE_MOCK } from './client';
import { httpApi } from './httpApi';
import { mockApi } from './mockApi';

export { USE_MOCK, setAuthToken, ApiError } from './client';
export { MIN_ORDER_ANTAR, SEARCH_RADIUS_KM } from './types';
export const api = USE_MOCK ? mockApi : httpApi;

export function errMsg(e: unknown) {
  return e instanceof Error ? e.message : 'Terjadi kesalahan. Coba lagi.';
}
