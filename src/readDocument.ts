import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const ReadDocumentResponse = z.object({
	content: z.object({
		text: z.string(),
		html_url: z.string(),
	}),
});

const userAgentString = 'emeditor-help-mcp';

const getURL = (path: string): string => {
	const normalized = new URL(`https://api.github.com/repos/Emurasoft/emurasoft.github.io/contents${path}`).pathname;
	if (!normalized.startsWith('/repos/Emurasoft/emurasoft.github.io/contents/')) {
		throw new Error(`invalid path: ${path}`);
	}

	return normalized;
};

const readDocument = async (
	path: string,
	githubToken: string,
): Promise<z.infer<typeof ReadDocumentResponse>['content']> => {
	const headers: Record<string, string> = {
		'User-Agent': userAgentString,
		Accept: 'application/vnd.github.object+json',
		Authorization: `Bearer ${githubToken}`,
	};
	const response = await fetch(getURL(path), { headers });

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	if (!(typeof data === 'object' && data !== null && 'type' in data)) {
		throw new Error('invalid GitHub response');
	}

	if (data.type !== 'file') {
		throw new Error('not a file');
	}

	if (
		!(
			'content' in data &&
			typeof data.content === 'string' &&
			'encoding' in data &&
			'html_url' in data &&
			typeof data.html_url === 'string'
		)
	) {
		throw new Error('invalid GitHub response');
	}

	if (data.encoding === 'base64' && data.content) {
		const bytes = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0));
		const decoded = new TextDecoder().decode(bytes);
		return {
			text: decoded,
			html_url: data.html_url,
		};
	}

	throw new Error('unexpected GitHub API response format');
};

export const registerReadDocument = (server: McpServer, githubToken: string): void => {
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
		async ({ path }) => {
			const content = await readDocument(path, githubToken);
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
