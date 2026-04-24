import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

export class EmEditorHelpMCP extends McpAgent {
	server = new McpServer(
		{
			name: "emeditor-help-mcp",
			title: "EmEditor Help Pages",
			description: "Provides access to EmEditor help pages hosted on https://help.emeditor.com",
			version: "1.0.0",
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
		this.server.registerTool(
			"list_directory",
			{
				description: "List the contents of a directory",
				inputSchema: {
					path: z.string(),
				},
				// TODO need to figure out how to indicate folder or file
				outputSchema: z.array(z.string()),
			},
			async () => {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(["testItem"]),
						}
					],
				}
			}
		);

		this.server.registerTool(
			"read_document",
			{
				description: "Read the contents of a help page",
				inputSchema: {
					path: z.string(),
					language: z.string(),
				},
				outputSchema: z.string(),
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
				description: "Searches for keywords in site",
				inputSchema: {
					query: z.string(),
				},
				outputSchema: {
					results: z.array(z.object({
						path: z.string(),
						matchedText: z.string(),
					})),
				}
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
