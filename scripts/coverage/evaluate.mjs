import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const report = JSON.parse(await readFile('coverage/normalized.json', 'utf8'));
const base = process.env.COVERAGE_BASE;
const head = process.env.COVERAGE_HEAD;
if (!base || !head) throw new Error('Coverage evaluation requires COVERAGE_BASE and COVERAGE_HEAD');
const diff = execFileSync('git', ['diff', '--unified=0', `${base}...${head}`, '--', 'src'], { encoding: 'utf8' });
const errors = [];
let file;
let line;
for (const rawLine of diff.split('\n')) {
  const fileMatch = rawLine.match(/^\+\+\+ b\/(.+)$/);
  if (fileMatch) file = fileMatch[1];
  const hunk = rawLine.match(/^@@ .* \+(\d+)(?:,(\d+))? @@/);
  if (hunk) line = Number(hunk[1]);
  else if (rawLine.startsWith('+') && !rawLine.startsWith('+++') && file) {
    const data = report.files[file];
    if (data && Object.values(data.locations).some((locations) => locations.some((entry) => entry.line === line && entry.covered <= 0)))
      errors.push({ code: 'changed-code-below-threshold', file, line });
    line += 1;
  } else if (line && !rawLine.startsWith('-')) line += 1;
}
const decision = { passed: errors.length === 0, errors };
await writeFile('coverage/changed-decision.json', `${JSON.stringify(decision, null, 2)}\n`);
if (errors.length) {
  console.error(JSON.stringify(decision, null, 2));
  process.exitCode = 1;
}
