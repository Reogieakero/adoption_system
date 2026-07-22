import { API_BASE_URL } from '@/lib/config';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new ApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

export async function adminRequest<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return data as T;
}

export function buildFormData(payload: Record<string, unknown>, fileKey: string, file: File | null): FormData {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === fileKey) return;
    if (value == null) return;
    formData.append(key, String(value));
  });
  if (file) {
    formData.append(fileKey, file);
  }
  return formData;
}

export function createServiceClient(basePath: string) {
  const base = `${API_BASE_URL}${basePath}`;
  return {
    request: <T>(path: string, init?: RequestInit) => adminRequest<T>(base, path, init),
    buildFormData,
  };
}
