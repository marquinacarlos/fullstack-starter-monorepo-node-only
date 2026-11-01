import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createApi } from './index.js';

const reply = (status, body) =>
  vi.fn().mockResolvedValue({ status, ok: status < 400, json: async () => body });

afterEach(() => vi.unstubAllGlobals());

describe('createApi', () => {
  it('throws when the URL is missing', () => {
    expect(() => createApi('')).toThrow('API URL is missing');
    expect(() => createApi(undefined)).toThrow('API URL is missing');
  });

  it('removes trailing slashes from the base URL', () => {
    expect(createApi('http://localhost:8000/').baseUrl).toBe('http://localhost:8000');
  });

  it('calls the versioned items endpoint', async () => {
    const fetchMock = reply(201, { id: 1 });
    vi.stubGlobal('fetch', fetchMock);
    await createApi('http://x').items.create({ name: 'a' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://x/api/v1/items');
    expect(init).toMatchObject({ method: 'POST', body: '{"name":"a"}' });
  });

  it('returns null for 204', async () => {
    vi.stubGlobal('fetch', reply(204));
    expect(await createApi('http://x').items.remove(1)).toBeNull();
  });

  it('throws ApiError with the server message', async () => {
    vi.stubGlobal('fetch', reply(422, { error: 'Validation error' }));
    const error = await createApi('http://x')
      .items.create({ name: '' })
      .catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 422, message: 'Validation error' });
  });
});
