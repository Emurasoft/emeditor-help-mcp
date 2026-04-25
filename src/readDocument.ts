import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const ReadDocumentResponse = z.object({
	content: z.object({
		text: z.string(),
	}),
});

const readDocument = async (path: string): Promise<z.infer<typeof ReadDocumentResponse>['content']> => {
	const url = `https://api.github.com/repos/Emurasoft/emurasoft.github.io/contents/${path.startsWith('/') ? path.slice(1) : path}`;
	const response = await fetch(url, {
		headers: {
			'User-Agent': 'emeditor-help-mcp',
			Accept: 'application/vnd.github.raw+json',
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
	}

	const text = await response.text();

	return {
		text
	};
};

export const registerReadDocument = (server: McpServer): void => {
	server.registerTool(
		'read_document',
		{
			title: 'Read document',
			description: 'Read the contents of a help page',
			inputSchema: {
				path: z.string(),
			},
			outputSchema: ReadDocumentResponse,
			annotations: {
				destructiveHint: false,
				readOnlyHint: true,
				openWorldHint: false,
				idempotentHint: true,
			},
		},
		async ({path}) => {
			const content = await readDocument(path);
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({content}),
					},
				],
				structuredContent: {content},
			};
		},
	);
};
