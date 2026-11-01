import { createServer } from 'node:http';
import { createApp } from './app.js';
import { loadConfig } from './core/config.js';
import { createPrisma } from './db/client.js';
import { attachRealtime } from './realtime/index.js';

let config;
try {
  config = loadConfig();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const prisma = createPrisma(config.databasePath);
const server = createServer(createApp({ config, prisma }));
attachRealtime(server, { corsOrigins: config.corsOrigins });

server.listen(config.port, () => {
  console.log(`API on http://localhost:${config.port} [${config.appEnv}]`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
