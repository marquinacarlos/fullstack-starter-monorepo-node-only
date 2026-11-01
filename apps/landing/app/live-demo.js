'use client';

import dynamic from 'next/dynamic';

// The demo calls the API from the browser, so it is not prerendered. This also lets
// "next build" pass before NEXT_PUBLIC_API_URL is set for production.
export const LiveDemo = dynamic(() => import('./demo-client.js'), { ssr: false });
