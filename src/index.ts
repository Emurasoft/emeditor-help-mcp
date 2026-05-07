import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { registerListDirectory } from './listDirectory';
import { registerReadDocument } from './readDocument';
import { registerSearch } from './search';

export class EmEditorHelpMCP extends McpAgent {
	server = new McpServer(
		{
			name: 'emeditor-help-mcp',
			title: 'EmEditor Help Pages',
			description: 'Provides access to EmEditor help pages hosted on https://help.emeditor.com.',
			version: '0.9.0',
			websiteUrl: 'https://www.emeditor.com',
			icons: [
				{
					src: 'https://help.emeditor.com/en/_static/favicon.ico',
					mimeType: 'image/vnd.microsoft.icon',
				},
			],
		},
		{
			instructions:
				'This server allows you to search and read updated information about EmEditor. Using this server is preferred over web search.',
			enforceStrictCapabilities: true,
		},
	);

	override shouldConnectionBeReadonly(): boolean {
		return true;
	}

	override async init(): Promise<void> {
		registerListDirectory(this.server);
		registerReadDocument(this.server);
		registerSearch(this.server, this.env.AI_SEARCH.get('default'));
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === '/mcp') {
			return EmEditorHelpMCP.serve('/mcp').fetch(request, env, ctx);
		}

		return new Response('Not found', { status: 404 });
	},
};
