import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const SearchResponse = z.object({
	content: z.array(
		z.object({
			id: z.string(),
			score: z.number(),
			text: z.string(),
			item: z.object({
				key: z.string(),
			}),
		}),
	),
});

const search = async (
	searchInstance: AiSearchInstance,
	query: string,
): Promise<z.infer<typeof SearchResponse>['content']> => {
	const result = await searchInstance.search({
		query,
	});

	return result.chunks;
};

export const registerSearch = (server: McpServer, searchInstance: AiSearchInstance): void => {
	server.registerTool(
		'search',
		{
			title: 'Search',
			description: 'Searches for keywords in site',
			inputSchema: {
				query: z.string(),
			},
			outputSchema: SearchResponse,
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
