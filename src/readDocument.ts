import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export const registerReadDocument = (server: McpServer): void => {
	server.registerTool(
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
};