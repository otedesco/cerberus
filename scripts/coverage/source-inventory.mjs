import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const files = [];
const ignored = new Set(['node_modules', 'dist', 'coverage', 'test', 'tests', '__tests__']);

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !ignored.has(entry.name)) await visit(path.join(directory, entry.name));
    if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) files.push(path.relative(root, path.join(directory, entry.name)).split(path.sep).join('/'));
  }
}

await visit(path.join(root, 'src'));
files.sort();
await mkdir('coverage', { recursive: true });
await writeFile('coverage/source-inventory.json', `${JSON.stringify({ schemaVersion: 1, files }, null, 2)}\n`);
