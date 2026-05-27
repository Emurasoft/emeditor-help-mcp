import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const SearchResponse = z.object({
	content: z.array(
		z.object({
			id: z.string(),
			score: z.number().describe('Higher score = better match'),
			path: z.string().describe('Use this path in read_document'),
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

	return result.chunks.map((item) => ({
		id: item.id,
		score: item.score,
		path: getItemPath(item.item.key),
		web_url: item.item.key,
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

const shouldReturnRateLimitError = async (rateLimiter: RateLimit, ip: string | null): Promise<boolean> => {
	if (ip === null) {
		return false;
	}

	const { success } = await rateLimiter.limit({ key: ip });
	if (!success) {
		// Retry after 1 second
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const { success: retrySuccess } = await rateLimiter.limit({ key: ip });
		if (!retrySuccess) {
			return true;
		}
	}

	return false;
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
			if (await shouldReturnRateLimitError(rateLimiter, ip)) {
				return rateLimitError;
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
