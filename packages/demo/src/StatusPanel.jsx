'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@repo/ui';
import { useApi } from './ApiContext.jsx';

export function StatusPanel() {
  const api = useApi();
  const { data, error, isPending } = useQuery({
    queryKey: ['health'],
    queryFn: api.health,
    refetchInterval: 5000,
  });

  return (
    <Card title="API status">
      {isPending && <p className="text-muted">Loading...</p>}
      {error && <p className="text-danger">API not reachable: {error.message}</p>}
      {data && (
        <p>
          Health: <strong className="text-success">{data.status}</strong>
        </p>
      )}
    </Card>
  );
}
