import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
export default {
  // Static frontend: no route handlers, no server actions, no middleware.
  output: 'export',
  // Next 16 writes AGENTS.md into the app on dev. Docs live in /docs instead.
  agentRules: false,
  images: { unoptimized: true },
  // Workspace packages are consumed as source, so Next must compile them.
  transpilePackages: ['@repo/demo', '@repo/lib', '@repo/ui'],
  turbopack: { root: fileURLToPath(new URL('../..', import.meta.url)) },
};
