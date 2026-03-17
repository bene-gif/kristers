import { watch } from 'node:fs';
import { mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const stateDir = path.join(repoRoot, '.autopush');
const logPath = path.join(stateDir, 'watcher.log');
const debounceMs = 4000;

const ignoredSegments = new Set([
  '.git',
  '.autopush',
  '.vite',
  '.vercel',
  'node_modules',
  'dist',
]);

let timerId = null;
let syncing = false;
let queued = false;

const stamp = () => new Date().toISOString();

const log = async (message) => {
  const line = `[${stamp()}] ${message}\n`;
  process.stdout.write(line);
  await appendFile(logPath, line);
};

const shouldIgnore = (relativePath = '') => {
  if (!relativePath) {
    return false;
  }

  const normalized = relativePath.split(path.sep);
  return normalized.some((segment) => ignoredSegments.has(segment));
};

const runGit = async (...args) => {
  const { stdout, stderr } = await execFileAsync('git', args, {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 20,
  });

  return `${stdout}${stderr}`.trim();
};

const syncChanges = async () => {
  if (syncing) {
    queued = true;
    return;
  }

  syncing = true;

  try {
    const status = await runGit('status', '--porcelain');
    if (!status) {
      await log('No changes detected, skipping.');
      return;
    }

    await log('Changes detected. Creating auto-sync commit.');
    await runGit('add', '-A');

    try {
      await runGit('commit', '-m', `Auto-sync ${stamp()}`);
    } catch (error) {
      const output = `${error.stdout ?? ''}\n${error.stderr ?? ''}`;
      if (!output.includes('nothing to commit')) {
        throw error;
      }
    }

    await runGit('push', 'origin', 'main');
    await log('Pushed latest changes to origin/main.');
  } catch (error) {
    const details = `${error.message}\n${error.stdout ?? ''}\n${error.stderr ?? ''}`.trim();
    await log(`Auto-push failed: ${details}`);
  } finally {
    syncing = false;

    if (queued) {
      queued = false;
      timerId = setTimeout(() => {
        void syncChanges();
      }, debounceMs);
    }
  }
};

const scheduleSync = (relativePath) => {
  if (shouldIgnore(relativePath)) {
    return;
  }

  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {
    void syncChanges();
  }, debounceMs);
};

await mkdir(stateDir, { recursive: true });
await log(`Watching ${repoRoot}`);

watch(repoRoot, { recursive: true }, (eventType, filename) => {
  const relativePath = typeof filename === 'string' ? filename : '';
  void log(`Detected ${eventType} in ${relativePath || '(unknown path)'}`);
  scheduleSync(relativePath);
});

process.on('SIGINT', async () => {
  await log('Stopping watcher.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await log('Stopping watcher.');
  process.exit(0);
});
