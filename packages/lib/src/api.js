export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Client for the REST API (v1). Used by web, desktop and landing.
 * The URL is public config: VITE_API_URL (Vite apps) or NEXT_PUBLIC_API_URL (Next).
 * There is no localhost fallback on purpose: a missing URL must fail loudly.
 */
export function createApi(baseUrl) {
  if (!baseUrl) {
    throw new Error('API URL is missing. Set VITE_API_URL (Vite) or NEXT_PUBLIC_API_URL (Next).');
  }
  const root = baseUrl.replace(/\/+$/, '');

  async function request(path, { method = 'GET', body } = {}) {
    const res = await fetch(`${root}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 204) return null;
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new ApiError(
        res.status,
        data?.error || `Request failed (${res.status})`,
        data?.details,
      );
    }
    return data;
  }

  return {
    baseUrl: root,
    health: () => request('/health'),
    /** CRUD for items (API v1). */
    items: {
      list: () => request('/api/v1/items'),
      create: (item) => request('/api/v1/items', { method: 'POST', body: item }),
      update: (id, item) => request(`/api/v1/items/${id}`, { method: 'PATCH', body: item }),
      remove: (id) => request(`/api/v1/items/${id}`, { method: 'DELETE' }),
    },
  };
}
