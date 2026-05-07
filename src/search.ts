import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const SearchResponse = z.object({
	content: z.array(
		z.object({
			path: z.string(),
			matchedText: z.string(),
		}),
	),
});

const search = (
	searchInstance: AiSearchInstance,
	query: string,
): Promise<z.infer<typeof SearchResponse>['content']> => {};

export const registerSearch = (server: McpServer, searchInstance: AiSearchInstance): void => {
	server.registerTool(
		'search',
		{
			title: 'Search',
			description: 'Searches for keywords in site',
			inputSchema: {
				query: z.string(),
			},
			outputSchema: {
				results: z.array(
					z.object({
						path: z.string(),
						matchedText: z.string(),
					}),
				),
			},
			annotations: {
				destructiveHint: false,
				readOnlyHint: true,
				openWorldHint: false,
				idempotentHint: true,
			},
		},
		async ({ query }) => {
			const content = await search(searchInstance, query);
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ content }),
					},
				],
				structuredContent: { content },
			};
		},
	);
};
