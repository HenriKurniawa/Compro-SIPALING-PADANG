// Pembungkus fetch ke backend. Alamat server diisi lewat file .env:
//   EXPO_PUBLIC_API_URL=https://api.sipaling.example.com
// Kalau kosong, aplikasi otomatis memakai data contoh (mock).

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
export const USE_MOCK = API_BASE_URL === '';

let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}
export function getAuthToken() {
  return authToken;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const res = await fetch(API_BASE_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const raw = data && typeof data === 'object' && 'message' in data ? (data as { message: unknown }).message : null;
    const msg = Array.isArray(raw) ? raw.join(', ') : raw ? String(raw) : `Terjadi kesalahan (${res.status})`;
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function qs(params: Record<string, string | undefined>) {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`);
  return parts.length ? `?${parts.join('&')}` : '';
}
