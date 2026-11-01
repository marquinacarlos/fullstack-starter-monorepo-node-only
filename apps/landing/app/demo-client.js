'use client';

import { DemoApp } from '@repo/demo';
import { createApi } from '@repo/lib';

const api = createApi(process.env.NEXT_PUBLIC_API_URL);

export default function DemoClient() {
  return <DemoApp api={api} />;
}
