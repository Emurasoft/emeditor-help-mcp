## Project structure

- `src/index.ts`: Contains server info
- `src/readPage.ts`: Contains the `read_page` tool
- `src/search.ts`: Contains the `search` tool

## Development commands

- Run `bun tsc --noEmit` to validate TypeScript without emitting files.
- Run `bun run lint:fix` at the end of a task.
- Run `bun run dev` to start the local Cloudflare Worker.
- Run `bun wrangler types` to update types after wrangler is updated.
- Run `bun run deploy` with explicit user confirmation to deploy to production.

## Runtime and configuration

- This project runs as a Cloudflare Worker. Keep worker bindings and deployment settings in `wrangler.jsonc`.
- `GITHUB_TOKEN` is required at runtime for reading documentation from GitHub. Never commit or output the token.
- The `AI_SEARCH`, `IP_RATE_LIMITER`, and `SEARCH_RATE_LIMITER` bindings are configured by Wrangler and should not be replaced with local hard-coded implementations.

## Project conventions

- Preserve strict TypeScript settings and validate external API responses before using them.
- Run `bun run lint:fix` after a task to ensure that the formatting is to project standards.