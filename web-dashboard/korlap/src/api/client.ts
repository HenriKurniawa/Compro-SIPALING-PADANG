const BASE_URL = import.meta.env.VITE_API_URL || '';

export const TOKEN_KEY = 'sipaling_korlap_token';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.message || `Request gagal dengan status ${res.status}` };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan jaringan' };
  }
}
