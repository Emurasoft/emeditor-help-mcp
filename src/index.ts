import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

const ListDirectoryResponse = z.array(z.object({
	name: z.string(),
	path: z.string(),
	type: z.enum(["page", "dir"]),
}));

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
				outputSchema: ListDirectoryResponse,
			},
			async ({ path }) => {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(await EmEditorHelpMCP.listDirectory(path)),
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

	private static async listDirectory(path: string): Promise<z.infer<typeof ListDirectoryResponse>> {
		const url = `https://api.github.com/repos/Emurasoft/emurasoft.github.io/contents${path}`;
		const response = await fetch(url, {
			headers: {
				"User-Agent": "emeditor-help-mcp",
				"Accept": "application/vnd.github.v3+json",
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		if (!Array.isArray(data)) {
			throw new Error('invalid GitHub response');
		}

		return data.map((item: any) => {
			if (typeof item !== 'object' || !item) {
				throw new Error('invalid GitHub response');
			}

			let type: 'page' | 'dir' = 'page';
			if (item.type === 'dir') {
				type = 'dir';
			}

			return {
				name: item.name,
				path: item.path,
				type,
			};
		});
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
