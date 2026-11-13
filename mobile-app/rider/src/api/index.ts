import { USE_MOCK } from './client';
import { httpApi } from './httpApi';
import { mockApi } from './mockApi';
import type { RidersApi } from './types';

// Semua layar memanggil `api` dari sini.
// Tanpa EXPO_PUBLIC_API_URL -> data contoh; dengan alamat server -> backend asli.
export const api: RidersApi = USE_MOCK ? mockApi : httpApi;
export { USE_MOCK, setAuthToken } from './client';
