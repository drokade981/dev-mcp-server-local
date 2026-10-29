# Dev MCP Server

A local [Model Context Protocol](https://modelcontextprotocol.io/) server written in TypeScript. It uses standard input/output (stdio), so Claude launches it as a local process.

## Requirements

- Node.js 18 or newer
- npm
- Claude Desktop, or Claude Code if you prefer the CLI

## Build

From the project directory, install dependencies and compile the server:

```powershell
npm install
npx tsc
```

The compiled entry point is `dist/index.js`. Use `npx tsc` on Windows: the current `npm run build` script also runs Unix `chmod`, which PowerShell does not provide. You can start the compiled server with `npm start` when testing locally; it waits for an MCP client over stdio.

## Connect with Claude Desktop

1. Build the project using the steps above.
2. In Claude Desktop, open **Settings > Developer > Edit Config**. This opens (or creates) the Claude Desktop configuration file. On Windows, the file is usually `%APPDATA%\Claude\claude_desktop_config.json`.
3. Add a `dev-mcp` entry under `mcpServers`. Replace the example path with the absolute path to this project's compiled `dist/index.js`:

```json
{
  "mcpServers": {
    "dev-mcp": {
      "command": "node",
      "args": ["E:\\study\\AI\\dev-mcp\\dist\\index.js"]
    }
  }
}
```

If the file already has other MCP servers, add only the `dev-mcp` property inside its existing `mcpServers` object; keep the existing entries and valid JSON commas. JSON paths on Windows use doubled backslashes, as shown above.

4. Save the config and fully quit and reopen Claude Desktop.
5. Open Claude's tools or MCP server list and confirm `dev-mcp` is connected. The server exposes the `get_all_students` tool and the `greeting-example` and `student_list` prompts. For `get_all_students`, provide a numeric `limit` to return that many sample student records.

Claude Desktop config locations on other platforms:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

## Connect with Claude Code (optional)

After building, register the server from the project directory:

```powershell
claude mcp add --transport stdio dev-mcp -- node "$PWD\dist\index.js"
```

Run the command from this project's root directory. Check the connection with `claude mcp list`.

## Troubleshooting

- **Server does not appear:** Confirm `dist/index.js` exists, the config points to its absolute path, and the JSON is valid; then restart Claude.
- **Node cannot be found:** Make sure Node.js is installed and `node` is available on the PATH used to launch Claude.
- **Changes are missing:** Run `npx tsc` again to rebuild, then restart Claude.
