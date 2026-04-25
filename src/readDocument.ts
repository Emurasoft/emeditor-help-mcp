import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const ReadDocumentResponse = z.object({
	content: z.object({
		text: z.string(),
	}),
});

const readDocument = async (path: string): Promise<z.infer<typeof ReadDocumentResponse>['content']> => {

}

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
				readOnlyHint: true,
				openWorldHint: false,
			},
		},
		async ({path}) => ({
			content: [
				{
					type: 'text',
					text: JSON.stringify({ content: await readDocument(path) }),
				},
			],
		}),
	);
};
