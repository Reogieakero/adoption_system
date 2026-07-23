import { API_BASE_URL } from './config';

function getToken(): string | null {
  return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
}

export async function residentFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function publicFetch<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}
