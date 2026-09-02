import { readFile, writeFile } from 'node:fs/promises';

const report = JSON.parse(await readFile('coverage/normalized.json', 'utf8'));
const baseline = JSON.parse(await readFile('coverage-baselines/current.json', 'utf8'));
const metrics = ['statements', 'branches', 'functions', 'lines'];
const current = Object.fromEntries(
  metrics.map((metric) => {
    const values = Object.values(report.files).map((file) => file[metric]);
    const total = values.reduce((sum, value) => sum + value.total, 0);
    const covered = values.reduce((sum, value) => sum + value.covered, 0);
    return [metric, { covered, total, percent: total ? (covered / total) * 100 : 100 }];
  }),
);
const errors = metrics
  .filter((metric) => current[metric].percent < baseline.metrics[metric].percent)
  .map((metric) => ({ code: 'global-coverage-regression', metric, previous: baseline.metrics[metric].percent, current: current[metric].percent }));
const decision = { passed: errors.length === 0, errors, proposedBaseline: { ...baseline, metrics: current } };
await writeFile('coverage/ratchet-decision.json', `${JSON.stringify(decision, null, 2)}\n`);
if (errors.length) {
  console.error(JSON.stringify(decision, null, 2));
  process.exitCode = 1;
}
