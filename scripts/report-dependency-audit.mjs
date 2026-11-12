import { execFileSync } from 'node:child_process';

let output = '';
try {
  output = execFileSync('npm', ['audit', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 8 * 1024 * 1024
  });
} catch (error) {
  output = String(error.stdout || '');
}

let report;
try {
  report = JSON.parse(output);
} catch {
  console.error('[dependency-audit] npm audit did not return valid JSON.');
  process.exit(1);
}

const totals = report.metadata?.vulnerabilities || {};
console.log('[dependency-audit] Advisory totals: ' + JSON.stringify(totals));

for (const [name, item] of Object.entries(report.vulnerabilities || {})) {
  const via = (item.via || []).map((entry) =>
    typeof entry === 'string'
      ? entry
      : {
          title: entry.title,
          severity: entry.severity,
          range: entry.range,
          url: entry.url
        }
  );
  console.log('[dependency-audit] ' + JSON.stringify({
    package: name,
    severity: item.severity,
    direct: item.isDirect,
    range: item.range,
    fixAvailable: item.fixAvailable,
    via
  }));
}

if (!Object.keys(report.vulnerabilities || {}).length) {
  console.log('[dependency-audit] No known package advisories were reported.');
}
