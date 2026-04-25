import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const ListDirectoryResponse = z.object({
	content: z.array(
		z.object({
			name: z.string(),
			path: z.string(),
			type: z.enum(['page', 'dir']),
		}),
	),
});

const listDirectory = async (path: string): Promise<z.infer<typeof ListDirectoryResponse>['content']> => {
	const url = `https://api.github.com/repos/Emurasoft/emurasoft.github.io/contents${path}`;
	const response = await fetch(url, {
		headers: {
			'User-Agent': 'emeditor-help-mcp',
			Accept: 'application/vnd.github.v3+json',
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	if (!Array.isArray(data)) {
		throw new Error('invalid GitHub response');
	}

	return data.map((item: unknown) => {
		if (
			!(
				typeof item === 'object' &&
				item !== null &&
				'type' in item &&
				'name' in item &&
				typeof item.name === 'string' &&
				'path' in item &&
				typeof item.path === 'string'
			)
		) {
			throw new Error('invalid GitHub response');
		}

		let type: 'page' | 'dir' = 'page';
		if (item.type === 'dir') {
			type = 'dir';
		}

		return {
			name: item.name,
			path: item.path,
			type,
		};
	});
};

export const registerListDirectory = (server: McpServer): void => {
	server.registerTool(
		'list_directory',
		{
			title: 'List directory',
			description: 'List the contents of a directory',
			inputSchema: {
				path: z.string(),
			},
			outputSchema: ListDirectoryResponse,
			annotations: {
				readOnlyHint: true,
				openWorldHint: false,
			},
		},
		async ({ path }) => ({
			content: [
				{
					type: 'text',
					text: JSON.stringify({ content: await listDirectory(path) }),
				},
			],
		}),
	);
};
