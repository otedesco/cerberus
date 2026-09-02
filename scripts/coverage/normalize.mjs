import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const metrics = ['statements', 'branches', 'functions', 'lines'];
const raw = JSON.parse(await readFile('coverage/coverage-final.json', 'utf8'));
const files = {};

for (const [name, data] of Object.entries(raw)) {
  const file = path.relative(process.cwd(), name).split(path.sep).join('/');
  const locations = {};
  const values = {};
  for (const metric of metrics) {
    const mapKey = metric === 'statements' ? 'statementMap' : metric === 'functions' ? 'fnMap' : metric === 'branches' ? 'branchMap' : null;
    const countKey = metric === 'statements' ? 's' : metric === 'functions' ? 'f' : metric === 'branches' ? 'b' : 'l';
    const entries = [];
    if (metric === 'lines') {
      for (const [line, count] of Object.entries(data.l ?? {})) entries.push({ line: Number(line), covered: count });
    } else if (mapKey) {
      for (const [id, location] of Object.entries(data[mapKey] ?? {})) {
        const counts = data[countKey]?.[id];
        const locationsForMetric = metric === 'branches' ? (location.locations ?? []) : [location.loc ?? location.decl ?? location];
        locationsForMetric.forEach((item, index) =>
          entries.push({ line: item.start?.line ?? item.start?.line, covered: metric === 'branches' ? (counts?.[index] ?? 0) : (counts ?? 0) }),
        );
      }
    }
    const valid = entries.filter((entry) => Number.isInteger(entry.line));
    locations[metric] = valid.sort((a, b) => a.line - b.line);
    values[metric] = { covered: valid.filter((entry) => entry.covered > 0).length, total: valid.length };
  }
  files[file] = { ...values, locations };
}

await mkdir('coverage', { recursive: true });
await writeFile('coverage/normalized.json', `${JSON.stringify({ schemaVersion: 1, files: Object.fromEntries(Object.entries(files).sort()) }, null, 2)}\n`);
