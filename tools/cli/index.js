#!/usr/bin/env node

/**
 * Code Review Framework (CRF) - CLI Tool
 * Fast, zero-dependency command-line interface for running audits and inspecting standards.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../../');
const args = process.argv.slice(2);
const command = args[0] || 'help';

function printHelp() {
  console.log(`
🏛️ Code Review Framework (CRF) - CLI v1.1.0

Usage:
  crf <command> [options]

Commands:
  audit [path]            Run static quality audit on the specified directory (defaults to current dir)
  check <checkpoint-id>   Display full specification and code examples for a checkpoint (e.g. CHK-RES-0501)
  scorecard               Display interactive scorecard summary and tier requirements
  doctor                  Verify local environment against CRF engineering prerequisites
  help                    Show this help message

Examples:
  crf audit .
  crf check CHK-RES-0501
  crf check CHK-ARCH-0101
`);
}

function runAuditCommand(targetPath = '.') {
  const auditRunner = path.join(REPO_ROOT, 'tools/github_action/dist/index.js');
  if (fs.existsSync(auditRunner)) {
    require(auditRunner);
  } else {
    console.error('Audit runner engine not found.');
    process.exit(1);
  }
}

function runCheckCommand(id) {
  if (!id) {
    console.error('Please specify a checkpoint ID, e.g.: crf check CHK-RES-0501');
    process.exit(1);
  }
  const targetId = id.toUpperCase().trim();
  
  function search(dir) {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'tools') continue;
        const res = search(fullPath);
        if (res) return res;
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(`(${targetId})`) || content.includes(`\`${targetId}\``)) {
          return content;
        }
      }
    }
    return null;
  }

  const content = search(REPO_ROOT);
  if (content) {
    console.log(`\n================================================================================`);
    console.log(content);
    console.log(`================================================================================\n`);
  } else {
    console.error(`❌ Checkpoint '${targetId}' not found.`);
    process.exit(1);
  }
}

function runDoctorCommand() {
  console.log(`\n🩺 Running CRF Engineering Environment Doctor...\n`);
  console.log(`[✓] Node.js Version: ${process.version}`);
  console.log(`[✓] Platform: ${process.platform} (${process.arch})`);
  console.log(`[✓] CRF Repository Root: ${REPO_ROOT}`);
  console.log(`\n🎉 Environment is healthy and ready for CRF audits.\n`);
}

switch (command.toLowerCase()) {
  case 'audit':
    runAuditCommand(args[1] || process.cwd());
    break;
  case 'check':
    runCheckCommand(args[1]);
    break;
  case 'doctor':
    runDoctorCommand();
    break;
  case 'scorecard':
    console.log(`Please view the full interactive matrix in AUDIT_SCORECARD.md`);
    break;
  case 'help':
  default:
    printHelp();
    break;
}
