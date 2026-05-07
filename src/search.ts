import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const SearchResponse = z.object({
	content: z.array(
		z.object({
			id: z.string(),
			score: z.number(),
			path: z.string(),
			web_url: z.string(),
		}),
	),
});

const getURLPath = (url: string): string => {
	try {
		return new URL(url).pathname;
	} catch (_) {
		return url;
	}
};

const search = async (
	searchInstance: AiSearchInstance,
	query: string,
): Promise<z.infer<typeof SearchResponse>['content']> => {
	const result = await searchInstance.search({
		query,
	});

	return result.chunks.map((result) => ({
		id: result.id,
		score: result.score,
		path: getURLPath(result.item.key),
		web_url: result.item.key,
	}));
};

export const registerSearch = (server: McpServer, searchInstance: AiSearchInstance): void => {
	server.registerTool(
		'search',
		{
			title: 'Search',
			description: 'Search in help pages',
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
