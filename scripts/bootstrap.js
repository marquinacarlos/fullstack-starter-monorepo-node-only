// First-run helper: installs dependencies, creates the SQLite database and adds demo rows.
import { spawnSync } from 'node:child_process';

// shell: true is only needed for the pnpm shim on Windows.
const run = (args) =>
  spawnSync('pnpm', args, { stdio: 'inherit', shell: process.platform === 'win32' }).status === 0;

if (!run(['install'])) process.exit(1);
if (!run(['--filter', '@repo/api', 'db:deploy'])) process.exit(1);
run(['--filter', '@repo/api', 'db:seed']);
console.log('Done. Run "pnpm dev".');
