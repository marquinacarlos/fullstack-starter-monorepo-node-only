import { io } from 'socket.io-client';

/**
 * Socket.IO helper. Events: "counter" (number from the server) and "echo" (text both ways).
 * onStatus receives "connecting" | "open" | "closed". Returns { echo, close }.
 */
export function connectRealtime(url, { onCounter, onEcho, onStatus = () => {} }) {
  onStatus('connecting');
  const socket = io(url);
  socket.on('connect', () => onStatus('open'));
  socket.on('disconnect', () => onStatus('closed'));
  socket.on('counter', (value) => onCounter?.(value));
  socket.on('echo', (text) => onEcho?.(text));
  return {
    echo: (text) => socket.emit('echo', text),
    close: () => socket.close(),
  };
}
