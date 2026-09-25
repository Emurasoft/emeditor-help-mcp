# EmEditor Help Pages MCP server

The EmEditor Help Pages MCP server (MCP server name `emeditor-help-mcp`) provides access to EmEditor help pages hosted at `https://help.emeditor.com`. It has two tools: one for searching for a help page and another for reading a help page.

When you use this MCP server with your AI app, the AI is able to answer EmEditor-related questions more accurately than an internet-wide search tool. 

## Adding this MCP server

The MCP server is hosted at `https://help.emeditor.com/mcp`. It does not require authenticating to connect. Follow the instructions below to use this MCP server in your AI app.

### EmEditor Chat with AI

- Chat with AI comes with the EmEditor help pages MCP connector built in! You only need to enable the connector to start using it.

1. Open Chat with AI in EmEditor. If Chat with AI is not installed, [see these instructions](https://help.emeditor.com/en/howto/plugin/plugin_chat_with_ai.html).
2. In Chat with AI, go to **⚙️ (top of sidebar) > Settings**. Go to the **MCP Connectors** page.
3. Enable **EmEditor Help Pages**. The connector will be available in new chats.

### Claude

1. Open **Settings** > **Connectors**.
2. Click **Add**.
3. In **Add custom connector**, set the name to `EmEditor Help Pages` and set the server URL to `https://help.emeditor.com/mcp`. Click **Continue**.
4. In **Authentication**, select **No sign-in** and click **Add**.
5. On the connector page, click **Connect** if prompted.

### Claude Code (For terminal)

1. In your terminal, run `claude mcp add --transport http emeditor-help-pages https://help.emeditor.com/mcp`.

### ChatGPT

1. Go to **Settings** > **Security and login**.
2. Enable **Developer mode**.
3. Close **Settings** and go to the **Plugins** page.
4. Click **+**, and click **Create app**.
5. Click **Create MCP App**.
6. In **New Plugin**, set these fields and then click **Create**.
  - **Name**: `EmEditor Help Pages`
  - **Connection**: `https://help.emeditor.com/mcp`
  - **Authentication**: **No Auth**
  - Acknowledge the disclaimer at the bottom.

### Other apps

- For apps that are not listed above, find instructions on how to add an MCP server. When prompted, use the following connection details:
  - Name: `EmEditor Help Pages`
  - Server URL: `https://help.emeditor.com/mcp`
  - Authentication type: No authentication
  - Transport protocol: Streamable HTTP

## Using the MCP server in a chat app

Once the MCP connector is enabled for your app, try asking an EmEditor-related question, for example:

> What is Chat with AI for EmEditor?

While generating a response, you may see a message indicating that the AI is using the EmEditor Help Pages connector to retrieve information. The response should include accurate, up-to-date information on the topic, sourced directly from the help pages.

## Project structure and build instructions

See [AGENTS.md](AGENTS.md).