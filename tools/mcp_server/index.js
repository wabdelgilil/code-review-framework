#!/usr/bin/env node

/**
 * Code Review Framework (CRF) - Model Context Protocol (MCP) Server
 * Standard JSON-RPC 2.0 MCP server over stdio.
 * Compatible with Cursor, Claude Desktop, Antigravity, Windsurf, Continue.
 * Zero external dependencies (pure Node.js 18+).
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../../');

// Static index of all 89 checkpoints with metadata
const CHECKPOINTS_META = [
  // Pillar 1
  { id: 'CHK-ARCH-0101', name: 'Zero Framework Leakage', pillar: '01', tier: 1 },
  { id: 'CHK-ARCH-0102', name: 'In-Memory Calculation Boundaries', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0103', name: 'Unidirectional Layer Dependencies', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0104', name: 'Circular Dependency Elimination', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0105', name: 'Abstract Service Contracts', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0106', name: 'Dependency Inversion & Injection', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0201', name: 'Single Responsibility Verification', pillar: '01', tier: 1 },
  { id: 'CHK-ARCH-0202', name: 'Open-Closed Extensibility', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0203', name: 'Cyclomatic Complexity Thresholds', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0204', name: 'Function Length & Nesting Limits', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0205', name: 'Zero Dead & Unreachable Code', pillar: '01', tier: 1 },
  { id: 'CHK-ARCH-0206', name: 'Commented-Out Code Prohibition', pillar: '01', tier: 1 },
  { id: 'CHK-ARCH-0301', name: 'Adapter Wrapper for 3rd-Party Libs', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0302', name: 'Deterministic Dependency Pinning', pillar: '01', tier: 1 },
  { id: 'CHK-ARCH-0303', name: 'Instability Index Compliance', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0304', name: 'Acyclic Dependency Graph', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0305', name: 'Automated SCA & CVE Scanning', pillar: '01', tier: 1 },
  { id: 'CHK-ARCH-0306', name: 'License Compliance & Copyleft Defense', pillar: '01', tier: 2 },
  { id: 'CHK-ARCH-0307', name: 'Typosquatting & Provenance Verification', pillar: '01', tier: 3 },
  { id: 'CHK-ARCH-0401', name: 'No Absolute Host Paths', pillar: '01', tier: 1 },
  { id: 'CHK-ARCH-0402', name: 'Working-Directory Agnostic Paths', pillar: '01', tier: 1 },

  // Pillar 2
  { id: 'CHK-DOM-0101', name: 'Zero External Driver Imports in Domain', pillar: '02', tier: 2 },
  { id: 'CHK-DOM-0102', name: 'Explicit Finite State Machines', pillar: '02', tier: 2 },
  { id: 'CHK-DOM-0103', name: 'Illegal States Made Unrepresentable', pillar: '02', tier: 3 },
  { id: 'CHK-DOM-0201', name: 'Epsilon Comparison Thresholds', pillar: '02', tier: 1 },
  { id: 'CHK-DOM-0202', name: 'Arbitrary Precision Currency Math', pillar: '02', tier: 2 },
  { id: 'CHK-DOM-0203', name: 'Division-by-Zero Defensive Guards', pillar: '02', tier: 1 },
  { id: 'CHK-DOM-0204', name: 'Checked Integer Arithmetic', pillar: '02', tier: 2 },
  { id: 'CHK-DOM-0301', name: 'UTC Storage & ISO 8601 Formatting', pillar: '02', tier: 1 },
  { id: 'CHK-DOM-0302', name: 'Leap Year & DST Transition Testing', pillar: '02', tier: 3 },
  { id: 'CHK-DOM-0401', name: 'Non-Negative Numeric ID Invariants', pillar: '02', tier: 2 },
  { id: 'CHK-DOM-0402', name: 'Canonical String Normalization', pillar: '02', tier: 2 },

  // Pillar 3
  { id: 'CHK-TEST-0101', name: 'Positive Happy Path Tests', pillar: '03', tier: 1 },
  { id: 'CHK-TEST-0102', name: 'Negative Path & Throws Assertions', pillar: '03', tier: 1 },
  { id: 'CHK-TEST-0103', name: 'Equivalence Partitioning & Boundary Testing', pillar: '03', tier: 2 },
  { id: 'CHK-TEST-0201', name: 'Deterministic Test Execution', pillar: '03', tier: 1 },
  { id: 'CHK-TEST-0202', name: 'Hermetic Isolation & Zero Shared State', pillar: '03', tier: 1 },
  { id: 'CHK-TEST-0203', name: 'Zero Arbitrary Sleep Delays', pillar: '03', tier: 2 },
  { id: 'CHK-TEST-0301', name: 'Minimum 80% Branch Coverage', pillar: '03', tier: 2 },
  { id: 'CHK-TEST-0302', name: 'Minimum 70% Mutation Score', pillar: '03', tier: 3 },
  { id: 'CHK-TEST-0401', name: 'Consumer-Driven Contract Testing', pillar: '03', tier: 2 },
  { id: 'CHK-TEST-0402', name: 'Zero Counterfeit Tests (Missing Assertions)', pillar: '03', tier: 1 },
  { id: 'CHK-TEST-0403', name: 'Strict vs Loose Mock Verification', pillar: '03', tier: 2 },
  { id: 'CHK-TEST-0501', name: 'End-to-End Golden Workflows', pillar: '03', tier: 2 },
  { id: 'CHK-TEST-0502', name: 'Schema Backward Compatibility Testing', pillar: '03', tier: 2 },

  // Pillar 4
  { id: 'CHK-RES-0101', name: 'Fail-Fast Precondition Guarding', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0102', name: 'Zero Swallowed Exceptions', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0103', name: 'Structured Domain Error Hierarchies', pillar: '04', tier: 2 },
  { id: 'CHK-RES-0201', name: 'Boundary Schema Parsing', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0202', name: 'Max Content-Length & Size Caps', pillar: '04', tier: 2 },
  { id: 'CHK-RES-0301', name: 'Finite I/O & Subprocess Timeouts', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0302', name: 'Circuit Breaker for Downstream Services', pillar: '04', tier: 3 },
  { id: 'CHK-RES-0303', name: 'Exponential Backoff with Full Jitter', pillar: '04', tier: 2 },
  { id: 'CHK-RES-0401', name: 'Deterministic RAII Resource Cleanup', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0402', name: 'Bounded In-Memory Buffers', pillar: '04', tier: 2 },
  { id: 'CHK-RES-0403', name: 'Bounded Concurrency Worker Pools', pillar: '04', tier: 2 },
  { id: 'CHK-RES-0501', name: 'Injection Prevention & Parameterized Queries', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0502', name: 'Zero Hardcoded Secrets & Credentials', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0503', name: 'Modern Cryptographic Hygiene', pillar: '04', tier: 2 },
  { id: 'CHK-RES-0504', name: 'CSPRNG for Security Sensitive Tokens', pillar: '04', tier: 1 },
  { id: 'CHK-RES-0505', name: 'Defense Against ReDoS', pillar: '04', tier: 2 },
  { id: 'CHK-RES-0506', name: 'Secure HTTP Headers & Cookies', pillar: '04', tier: 2 },

  // Pillar 5
  { id: 'CHK-PERF-0101', name: 'Zero Nested O(N^2) Iterations', pillar: '05', tier: 1 },
  { id: 'CHK-PERF-0102', name: 'Optimal Container Lookup Complexity', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0103', name: 'Lazy Evaluation for Large Streams', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0201', name: 'Mandatory Pagination & Query Limits', pillar: '05', tier: 1 },
  { id: 'CHK-PERF-0202', name: 'Elimination of N+1 Queries', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0203', name: 'Covering Database Indexes', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0301', name: 'Zero Event Listener Memory Leaks', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0302', name: 'Chunked Stream I/O for Large Files', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0303', name: 'Reusable Allocation Buffers', pillar: '05', tier: 3 },
  { id: 'CHK-PERF-0401', name: 'Non-Blocking Main Thread Event Loop', pillar: '05', tier: 1 },
  { id: 'CHK-PERF-0402', name: 'Bounded Thread Concurrency Limits', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0403', name: 'Cache Expiration & LRU Eviction', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0404', name: 'Payload Compression & Minification', pillar: '05', tier: 2 },
  { id: 'CHK-PERF-0405', name: 'Micro-Benchmark Latency Gating', pillar: '05', tier: 3 },

  // Pillar 6
  { id: 'CHK-UX-0101', name: 'Single-Command Deterministic Build', pillar: '06', tier: 1 },
  { id: 'CHK-UX-0102', name: 'Explicit System Prerequisites', pillar: '06', tier: 1 },
  { id: 'CHK-UX-0103', name: 'Offline Development Mocking', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0201', name: 'Exhaustive Interface Documentation', pillar: '06', tier: 1 },
  { id: 'CHK-UX-0202', name: 'Inline Rationales for Non-Obvious Code', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0203', name: 'Automated Documentation Freshness', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0301', name: 'Three-Part Actionable Diagnostic Format', pillar: '06', tier: 1 },
  { id: 'CHK-UX-0302', name: 'Structured Contextual Logging', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0303', name: 'PII Masking & Privacy Filtering', pillar: '06', tier: 1 },
  { id: 'CHK-UX-0401', name: 'SemVer Governance & Automated Changelog', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0402', name: 'Health & Readiness Observability Probes', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0403', name: 'OpenTelemetry Metrics & Trace Hooks', pillar: '06', tier: 3 },
  { id: 'CHK-UX-0404', name: 'Codified Operational Runbooks', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0405', name: 'Graceful Shutdown & Signal Handling', pillar: '06', tier: 2 },
  { id: 'CHK-UX-0406', name: 'Zero-Downtime Migration & Rollback', pillar: '06', tier: 3 }
];

function findCheckpointFile(id) {
  // Search through all markdown files in REPO_ROOT
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
        if (content.includes(`(${id})`) || content.includes(`\`${id}\``)) {
          return fullPath;
        }
      }
    }
    return null;
  }
  return search(REPO_ROOT);
}

// Tool definitions
const TOOLS = [
  {
    name: 'list_checkpoints',
    description: 'List all available checkpoints in the Code Review Framework with their ID, name, pillar, and assurance tier.',
    inputSchema: {
      type: 'object',
      properties: {
        pillar: {
          type: 'string',
          description: 'Filter by pillar: 01 (Architecture), 02 (Domain), 03 (Testing), 04 (Resilience), 05 (Performance), 06 (Operations)'
        },
        tier: {
          type: 'number',
          description: 'Filter by assurance tier: 1 (Hygiene), 2 (Enterprise), 3 (Mission-Critical)'
        }
      }
    }
  },
  {
    name: 'get_checkpoint',
    description: 'Fetch the complete specification, rationale, anti-pattern code, canonical pattern code, and pass/fail criteria for a specific checkpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        checkpoint_id: {
          type: 'string',
          description: 'The checkpoint ID (e.g. CHK-RES-0501, CHK-ARCH-0101, CHK-DOM-0201)'
        }
      },
      required: ['checkpoint_id']
    }
  },
  {
    name: 'search_checkpoints',
    description: 'Search checkpoints by natural language keyword, error type, or concept (e.g. "sql injection", "memory leak", "timeout", "float").',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keywords or phrases'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'audit_code_snippet',
    description: 'Quickly scan a snippet of code for obvious CRF anti-patterns (e.g. swallowed errors, float == comparisons, arbitrary sleep, hardcoded secrets).',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The code snippet to evaluate'
        },
        filename: {
          type: 'string',
          description: 'Optional filename (e.g. auth.ts, user_test.py) to inform context'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'calculate_grade',
    description: 'Calculate overall compliance percentage and letter grade (A+, A, B, C, F) based on pass/fail counts from the 89-point audit scorecard.',
    inputSchema: {
      type: 'object',
      properties: {
        passed_count: {
          type: 'number',
          description: 'Number of passed checkpoints'
        },
        na_count: {
          type: 'number',
          description: 'Number of non-applicable (N/A) checkpoints',
          default: 0
        },
        has_l1_failures: {
          type: 'boolean',
          description: 'Whether any Tier 1 (Hygiene) checkpoints failed',
          default: false
        }
      },
      required: ['passed_count']
    }
  }
];

function handleToolCall(name, args) {
  if (name === 'list_checkpoints') {
    let list = CHECKPOINTS_META;
    if (args.pillar) list = list.filter(c => c.pillar === args.pillar);
    if (args.tier) list = list.filter(c => c.tier === Number(args.tier));
    return {
      total: list.length,
      checkpoints: list
    };
  }

  if (name === 'get_checkpoint') {
    const id = args.checkpoint_id.toUpperCase().trim();
    const filePath = findCheckpointFile(id);
    if (filePath && fs.existsSync(filePath)) {
      return {
        id,
        source_path: path.relative(REPO_ROOT, filePath),
        content: fs.readFileSync(filePath, 'utf8')
      };
    }
    const meta = CHECKPOINTS_META.find(c => c.id === id);
    if (meta) {
      return {
        id,
        name: meta.name,
        tier: meta.tier,
        pillar: meta.pillar,
        note: `Checkpoint metadata found. See documentation in pillar ${meta.pillar}.`
      };
    }
    throw new Error(`Checkpoint ID '${id}' not found in framework index.`);
  }

  if (name === 'search_checkpoints') {
    const q = (args.query || '').toLowerCase();
    const matches = CHECKPOINTS_META.filter(c => 
      c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
    return {
      query: args.query,
      match_count: matches.length,
      results: matches
    };
  }

  if (name === 'audit_code_snippet') {
    const code = args.code || '';
    const issues = [];
    if (/catch\s*\([^)]*\)\s*\{\s*\}|except\s*:\s*pass/.test(code)) {
      issues.push({
        code: 'CHK-RES-0102',
        severity: 'issue (blocking)',
        message: 'Empty catch/except block silently swallows error state.'
      });
    }
    if (/(?:api_?key|secret|token|password)\s*[:=]\s*["'][A-Za-z0-9_\-\.]{20,}["']/i.test(code)) {
      issues.push({
        code: 'CHK-RES-0502',
        severity: 'issue (blocking)',
        message: 'Hardcoded secret token or credential detected in source code.'
      });
    }
    if (/==\s*0\.\d+|!=\s*0\.\d+/.test(code)) {
      issues.push({
        code: 'CHK-DOM-0201',
        severity: 'issue (blocking)',
        message: 'Floating-point number compared with exact equality (==). Use epsilon bounds.'
      });
    }
    if (/(?:Thread\.sleep|time\.sleep|await\s+sleep|sleep)\s*\(\s*\d+\s*\)/.test(code)) {
      issues.push({
        code: 'CHK-TEST-0203',
        severity: 'suggestion (non-blocking)',
        message: 'Arbitrary sleep duration in code/tests; use explicit event pollers or waiters.'
      });
    }
    return {
      scanned_length: code.length,
      findings_count: issues.length,
      findings: issues,
      verdict: issues.some(i => i.severity.includes('blocking')) ? 'REJECTED' : 'PASSED'
    };
  }

  if (name === 'calculate_grade') {
    const passed = Number(args.passed_count) || 0;
    const na = Number(args.na_count) || 0;
    const totalApplicable = 89 - na;
    const score = totalApplicable > 0 ? (passed / totalApplicable) * 100 : 0;
    let grade = 'F';
    let verdict = 'REJECTED';

    if (args.has_l1_failures) {
      grade = 'F';
      verdict = 'REJECTED (Critical L1 Failure)';
    } else if (score >= 98) {
      grade = 'A+';
      verdict = 'APPROVED (Immediate)';
    } else if (score >= 90) {
      grade = 'A';
      verdict = 'APPROVED (Enterprise Production Ready)';
    } else if (score >= 80) {
      grade = 'B';
      verdict = 'CONDITIONALLY APPROVED';
    } else if (score >= 65) {
      grade = 'C';
      verdict = 'BLOCKED (Remediation Required)';
    }

    return {
      evaluated_score: `${score.toFixed(1)}%`,
      grade,
      verdict,
      passed,
      total_applicable: totalApplicable
    };
  }

  throw new Error(`Unknown tool: ${name}`);
}

// Stdio JSON-RPC 2.0 loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  let request;
  try {
    request = JSON.parse(line);
  } catch (err) {
    return;
  }

  const { id, method, params } = request;

  if (method === 'initialize') {
    const response = {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'code-review-framework',
          version: '1.1.0'
        }
      }
    };
    process.stdout.write(JSON.stringify(response) + '\n');
    return;
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'tools/list') {
    const response = {
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS
      }
    };
    process.stdout.write(JSON.stringify(response) + '\n');
    return;
  }

  if (method === 'tools/call') {
    try {
      const toolName = params.name;
      const toolArgs = params.arguments || {};
      const resultData = handleToolCall(toolName, toolArgs);
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2)
            }
          ]
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (err) {
      const response = {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: err.message
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    }
    return;
  }

  // Fallback for unhandled methods
  if (id !== undefined) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method '${method}' not found` }
    }) + '\n');
  }
});
