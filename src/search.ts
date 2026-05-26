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

const getItemPath = (url: string): string => {
	try {
		return new URL(url).pathname.replace(/\.html$/, '.md');
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
		path: getItemPath(result.item.key),
		web_url: result.item.key,
	}));
};

export const rateLimitResponseObj = {
	code: -32029,
	message: 'IP rate limit exceeded',
	data: {
		code: 'rate_limited',
	},
};

const rateLimitError = {
	content: [
		{
			type: 'text' as const,
			text: JSON.stringify({
				error: rateLimitResponseObj,
			}),
		},
	],
	isError: true,
};

export const registerSearch = (
	server: McpServer,
	searchInstance: AiSearchInstance,
	rateLimiter: RateLimit,
	ip: string | null,
): void => {
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
			if (ip !== null) {
				const { success } = await rateLimiter.limit({ key: ip });
				if (!success) {
					return rateLimitError;
				}
			}

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
