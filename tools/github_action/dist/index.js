/**
 * Code Review Framework (CRF) - Automated Audit Runner
 * Zero-dependency standalone Node.js audit engine for CI/CD and CLI usage.
 */

const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  'node_modules', '.git', '.github', 'dist', 'build', 'coverage', 
  '.idea', '.vscode', 'vendor', 'tmp'
]);

const EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.cs', '.cpp', '.c'
]);

const RULES = [
  {
    code: 'CHK-RES-0102',
    name: 'Zero Swallowed Exceptions',
    tier: 1,
    severity: 'blocking',
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}|except\s*:\s*pass|except\s+\w+\s*:\s*pass/g,
    message: 'Empty catch or except block silently swallows error state.'
  },
  {
    code: 'CHK-RES-0502',
    name: 'Zero Hardcoded Secrets',
    tier: 1,
    severity: 'blocking',
    pattern: /(?:api_?key|secret|token|password)\s*[:=]\s*["'][A-Za-z0-9_\-\.]{20,}["']/i,
    message: 'Potential secret token or credential detected in source code.'
  },
  {
    code: 'CHK-ARCH-0401',
    name: 'No Absolute Host Paths',
    tier: 1,
    severity: 'blocking',
    pattern: /["'](?:[A-Za-z]:\\|\/home\/|\/Users\/)[^"']+["']/,
    message: 'Absolute host path hardcoded into source code.'
  },
  {
    code: 'CHK-TEST-0203',
    name: 'Zero Arbitrary Sleep in Tests',
    tier: 2,
    severity: 'warning',
    testOnly: true,
    pattern: /(?:Thread\.sleep|time\.sleep|await\s+sleep|sleep)\s*\(\s*\d+\s*\)/,
    message: 'Arbitrary sleep duration detected; use explicit pollers or event waiters.'
  }
];

function scanDirectory(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function runAudit(targetDir = process.cwd()) {
  console.log(`\n🔍 Code Review Framework (CRF) - Static Audit Gate`);
  console.log(`📂 Scanning directory: ${targetDir}\n`);

  const files = scanDirectory(targetDir);
  console.log(`Found ${files.length} source files to inspect.`);

  const findings = [];

  for (const file of files) {
    const isTestFile = /(test|spec)\.[a-zA-Z0-9]+$/.test(file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const rule of RULES) {
        if (rule.testOnly && !isTestFile) continue;
        if (rule.pattern.test(line)) {
          findings.push({
            code: rule.code,
            name: rule.name,
            severity: rule.severity,
            file: path.relative(targetDir, file),
            line: i + 1,
            snippet: line.trim(),
            message: rule.message
          });
        }
      }
    }
  }

  console.log(`\n--- 📊 Audit Results ---`);
  if (findings.length === 0) {
    console.log(`✅ 100% PASS! No violations detected across inspected CRF checkpoints.\n`);
    process.exit(0);
  }

  const blockers = findings.filter(f => f.severity === 'blocking');
  console.log(`⚠️ Detected ${findings.length} total findings (${blockers.length} blocking issues):\n`);

  for (const f of findings) {
    const icon = f.severity === 'blocking' ? '🚨' : '⚠️';
    console.log(`${icon} [${f.code}] ${f.name} in ${f.file}:${f.line}`);
    console.log(`   Issue: ${f.message}`);
    console.log(`   Line:  ${f.snippet}\n`);
  }

  if (blockers.length > 0) {
    console.error(`❌ Build failed: ${blockers.length} blocking CRF checkpoints violated.`);
    process.exit(1);
  }
}

runAudit();
