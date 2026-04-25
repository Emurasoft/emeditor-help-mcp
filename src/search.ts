import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export const registerSearch = (server: McpServer): void => {
	server.registerTool(
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
};