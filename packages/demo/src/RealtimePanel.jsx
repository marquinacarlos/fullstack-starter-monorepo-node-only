'use client';

import { useEffect, useRef, useState } from 'react';
import { connectRealtime } from '@repo/lib';
import { Button, Card, Input } from '@repo/ui';
import { useApi } from './ApiContext.jsx';

export function RealtimePanel() {
  const api = useApi();
  const socket = useRef(null);
  const [status, setStatus] = useState('connecting');
  const [counter, setCounter] = useState(null);
  const [echo, setEcho] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const connection = connectRealtime(api.baseUrl, {
      onStatus: setStatus,
      onCounter: setCounter,
      onEcho: setEcho,
    });
    socket.current = connection;
    return () => connection.close();
  }, [api.baseUrl]);

  const send = (event) => {
    event.preventDefault();
    if (text) socket.current?.echo(text);
  };

  return (
    <Card title="Socket.IO">
      <p>
        Status: <strong>{status}</strong> · Counter: <strong>{counter ?? '-'}</strong>
      </p>
      <form onSubmit={send} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Say something" />
        <Button type="submit">Echo</Button>
      </form>
      {echo !== null && <p className="mt-2 text-sm text-muted">Echo: {echo}</p>}
    </Card>
  );
}
