export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new HttpError(response.status, message, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/** The single HTTP client. Every API module goes through this. */
export const http = {
  get: <T>(path: string): Promise<T> => request<T>(path),
  post: <T>(path: string, data: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(path: string, data: unknown): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string): Promise<T> => request<T>(path, { method: 'DELETE' }),
};
