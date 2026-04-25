import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import {userAgentString} from './index';

const ReadDocumentResponse = z.object({
	content: z.object({
		text: z.string(),
	}),
});

const readDocument = async (path: string): Promise<z.infer<typeof ReadDocumentResponse>['content']> => {
	const url = `https://api.github.com/repos/Emurasoft/emurasoft.github.io/contents/${path.startsWith('/') ? path.slice(1) : path}`;
	const response = await fetch(url, {
		headers: {
			'User-Agent': userAgentString,
			Accept: 'application/vnd.github.object+json',
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	if (
		!(typeof data === 'object' && data !== null
		&& 'type' in data)
	) {
		throw new Error('invalid GitHub response');
	}

	if (data.type !== 'file') {
		throw new Error('not a file');
	}

	if (!('content' in data && typeof data.content === 'string' && 'encoding' in data)) {
		throw new Error('invalid GitHub response');
	}

	if (data.encoding === 'base64' && data.content) {
		const bytes = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0));
		const decoded = new TextDecoder().decode(bytes);
		return {
			text: decoded,
		};
	}

	throw new Error('Unexpected GitHub API response format');
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
