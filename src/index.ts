import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import {registerListDirectory} from './listDirectory';

export class EmEditorHelpMCP extends McpAgent {
	server = new McpServer(
		{
			name: "emeditor-help-mcp",
			title: "EmEditor Help Pages",
			description: "Provides access to EmEditor help pages hosted on https://help.emeditor.com",
			version: "0.9.0",
			websiteUrl: "https://www.emeditor.com",
			icons: [
				{
					src: "https://www.emeditor.org/en/_static/favicon.ico",
					mimeType: "image/vnd.microsoft.icon",
				}
			],
		},
		{
			instructions: "This server provides access to EmEditor help pages hosted on help.emeditor.com. Read pages relevant to the user's question for updated information about EmEditor.",
			enforceStrictCapabilities: true,
		}
	);

	shouldConnectionBeReadonly(): boolean {
		return true;
	}

	async init() {
		registerListDirectory(this.server)

		this.server.registerTool(
			"read_document",
			{
				title: "Read document",
				description: "Read the contents of a help page",
				inputSchema: {
					path: z.string(),
					language: z.string(),
				},
				outputSchema: z.string(),
				annotations: {
					readOnlyHint: true,
					openWorldHint: false,
				},
			},
			async () => {
				return {
					content: [
						{
							type: "text",
							text: "Document text",
						},
					],
				}
			}
		)

		this.server.registerTool(
			"search",
			{
				title: "Search",
				description: "Searches for keywords in site",
				inputSchema: {
					query: z.string(),
				},
				outputSchema: {
					results: z.array(z.object({
						path: z.string(),
						matchedText: z.string(),
					})),
				},
				annotations: {
					readOnlyHint: true,
					openWorldHint: false,
				},
			},
			async () => {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify([]),
						},
					],
				}
			}
		)
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			return EmEditorHelpMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
