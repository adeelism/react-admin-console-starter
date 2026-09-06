import { describe, expect, it } from 'vitest';
import { http as mswHttp, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { http, HttpError } from './http';

describe('http client', () => {
  it('returns parsed JSON on success', async () => {
    server.use(mswHttp.get('*/api/ping', () => HttpResponse.json({ ok: true })));
    await expect(http.get('/ping')).resolves.toEqual({ ok: true });
  });

  it('returns undefined for 204 No Content', async () => {
    server.use(mswHttp.delete('*/api/thing/:id', () => new HttpResponse(null, { status: 204 })));
    await expect(http.delete('/thing/1')).resolves.toBeUndefined();
  });

  it('throws HttpError with status and message from the body', async () => {
    server.use(
      mswHttp.get('*/api/boom', () => HttpResponse.json({ message: 'nope' }, { status: 400 })),
    );
    await expect(http.get('/boom')).rejects.toBeInstanceOf(HttpError);
    await expect(http.get('/boom')).rejects.toMatchObject({ status: 400, message: 'nope' });
  });

  it('falls back to a generic message when the body has none', async () => {
    server.use(mswHttp.get('*/api/err', () => new HttpResponse('boom', { status: 500 })));
    await expect(http.get('/err')).rejects.toMatchObject({ status: 500 });
  });

  it('sends a POST body and returns the created resource', async () => {
    server.use(
      mswHttp.post('*/api/echo', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body, { status: 201 });
      }),
    );
    await expect(http.post('/echo', { a: 1 })).resolves.toEqual({ a: 1 });
  });
});
