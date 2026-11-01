FROM node:20-alpine

WORKDIR /app

# Copy repository files
COPY . .

# Run MCP server over stdio
ENTRYPOINT ["node", "tools/mcp_server/index.js"]
