'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiProvider } from './ApiContext.jsx';
import { StatusPanel } from './StatusPanel.jsx';
import { ItemsPanel } from './ItemsPanel.jsx';
import { RealtimePanel } from './RealtimePanel.jsx';

/**
 * Demo screen shared by web, desktop and landing: one independent panel per feature.
 * Panels share nothing but the API client. Delete a panel here to remove its feature.
 * Query keys start with the channel name ("items", "health", ...).
 */
export function DemoApp({ api }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );

  return (
    <ApiProvider value={api}>
      <QueryClientProvider client={queryClient}>
        <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Fullstack starter</h1>
          <p className="mb-6 mt-1 text-sm text-muted">API: {api.baseUrl}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatusPanel />
            <RealtimePanel />
            <ItemsPanel />
          </div>
        </main>
      </QueryClientProvider>
    </ApiProvider>
  );
}
