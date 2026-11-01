# 🤖 Code Review Framework (CRF) - MCP Server

Official **Model Context Protocol (MCP)** server for the Code Review Framework.

Allows your AI assistant (Cursor, Claude Desktop, Antigravity, Windsurf) to query the 89 software quality checkpoints, audit code snippets, search standards, and compute compliance scorecard grades natively.

---

## ⚡ Instant Setup in AI Editors

### 1. Cursor IDE Configuration
Add the server to your `~/.cursor/mcp.json` (or Cursor Settings > Features > MCP):

```json
{
  "mcpServers": {
    "code-review-framework": {
      "command": "node",
      "args": ["D:/programming/code-review-framework/tools/mcp_server/index.js"]
    }
  }
}
```

### 2. Claude Desktop Configuration
Add the server to your `claude_desktop_config.json`:
* **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "code-review-framework": {
      "command": "node",
      "args": ["path/to/code-review-framework/tools/mcp_server/index.js"]
    }
  }
}
```

### 3. Google Antigravity / Agentic Environments
In Antigravity or any agentic system supporting MCP:
```json
{
  "code-review-framework": {
    "command": "node",
    "args": ["D:/programming/code-review-framework/tools/mcp_server/index.js"]
  }
}
```

---

## 🛠️ Available MCP Tools

| Tool Name | Description | Key Arguments |
| :--- | :--- | :--- |
| `list_checkpoints` | Lists checkpoints filtered by Pillar (01–06) or Assurance Tier (1–3). | `pillar`, `tier` |
| `get_checkpoint` | Fetches complete specification, anti-pattern, and canonical code for a checkpoint. | `checkpoint_id` (e.g. `CHK-RES-0501`) |
| `search_checkpoints` | Natural language search across all 89 checkpoints (e.g. "sql injection", "timeout"). | `query` |
| `audit_code_snippet` | Scans a code snippet for common defects (swallowed errors, float equality, secrets). | `code`, `filename` |
| `calculate_grade` | Computes compliance score and letter grade (A+ to F) from audit results. | `passed_count`, `na_count` |
