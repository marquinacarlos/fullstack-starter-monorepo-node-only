import { createServer } from 'node:http';
import { io } from 'socket.io-client';
import { afterEach, describe, expect, it } from 'vitest';
import { attachRealtime } from '../src/realtime/index.js';

let server;
let client;
afterEach(async () => {
  client?.close();
  await new Promise((resolve) => server.close(resolve));
});

describe('realtime', () => {
  it('sends a counter and echoes text', async () => {
    server = createServer();
    const sockets = attachRealtime(server, { corsOrigins: '*', intervalMs: 20 });
    await new Promise((resolve) => server.listen(0, resolve));

    client = io(`http://localhost:${server.address().port}`);
    const counters = [];
    let echoed;
    client.on('counter', (value) => counters.push(value));
    client.on('echo', (text) => (echoed = text));
    client.on('connect', () => client.emit('echo', 'hello'));

    await expect.poll(() => counters.length > 0 && echoed, { timeout: 2000 }).toBe('hello');
    expect(counters[0]).toBe(1);
    sockets.close();
  });
});
