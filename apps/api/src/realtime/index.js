import { Server } from 'socket.io';

/**
 * Socket.IO channel. Events:
 *   server -> client  "counter" (number, every second)
 *   client -> server  "echo" (text)   server -> client  "echo" (same text)
 */
export function attachRealtime(httpServer, { corsOrigins, intervalMs = 1000 }) {
  const io = new Server(httpServer, { cors: { origin: corsOrigins } });

  io.on('connection', (socket) => {
    let counter = 0;
    const timer = setInterval(() => socket.emit('counter', ++counter), intervalMs);
    socket.on('echo', (text) => socket.emit('echo', String(text)));
    socket.on('disconnect', () => clearInterval(timer));
  });

  return io;
}
