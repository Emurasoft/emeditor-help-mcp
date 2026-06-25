# Write GITHUB_TOKEN from system env into .env for worker
"GITHUB_TOKEN=$env:GITHUB_TOKEN" | Set-Content .env

try {
    yarn wrangler dev
} finally {
    Remove-Item .env -ErrorAction SilentlyContinue
}