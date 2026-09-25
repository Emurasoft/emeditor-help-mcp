# EmEditor help pages MCP server

EmEditor help pages MCP (MCP server name `emeditor-help-mcp`) provides access to EmEditor help pages hosted on `https://help.emeditor.com`. It has two tools: 1. search for a help page and 2. read a help page.

When this MCP server is used in your AI app, the AI is able to answer EmEditor-related questions more accurately than an internet-wide search tool. 

## Adding this MCP server

The MCP server is hosted at `https://help.emeditor.com/mcp`. It does not require authentication for connecting. See the following instructions for using this MCP server in your AI app.

### EmEditor Chat with AI

- The EmEditor help pages MCP connector is added by default to Chat with AI! All you need to do is to enable the connector.

1. Open Chat with AI in EmEditor. If Chat with AI is not installed, [see these instructions](https://help.emeditor.com/en/howto/plugin/plugin_chat_with_ai.html).
2. In Chat with AI, go to **⚙️ (top of sidebar) > Settings**. Go to the **MCP Connectors** page. Enable **EmEditor Help Pages**. The connector will be available to use in new chats.

### Claude

1. Open **Settings**. Go to **Connectors**.
2. Click **Add**.
3. In **Add custom connector**, set the name to `EmEditor Help Pages` and set the server URL to `https://help.emeditor.com/mcp`. Click **Continue**.
4. Select **No sign-in** and click **Add**.
5. In the connector, click **Connect** if prompted.

### Claude Code (For terminal)

1. In your terminal, run `claude mcp add --transport http emeditor-help-pages https://help.emeditor.com/mcp`.

### ChatGPT

1. Go to **Settings**. Go to **Security and login**.
2. Enable **Developer mode**.
3. Close **Settings** and go to the **Plugins** page.
4. Click **+**, and click **Create app**.
5. Click **Create MCP App**.
6. In **New Plugin**, set these fields and click **Create**.
  - **Name**: `EmEditor Help Pages`
  - **Connection**: `https://help.emeditor.com/mcp`
  - **Authentication**: **No Auth**
  - Read and check the disclaimer at the bottom.
