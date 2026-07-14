# EpicStrafe

An open-source interface for browsing StrafesNET Roblox bhop and surf users, maps, records, ranks, comparisons, and WebGPU replays.

This project is based on the original MIT-licensed [`fiveman1/strafes-site`](https://github.com/fiveman1/strafes-site). The refreshed interface and replay reliability improvements were made by **@quadrics on Discord**.

## Features

- User search, profiles, times, and statistics
- Global records and ranked leaderboards
- Map browser with filtering, sorting, and CSV export
- Head-to-head user comparisons
- WebGPU replay player with download timeouts and non-blocking comparison data
- Responsive light and dark themes
- Roblox OAuth, account settings, and tier voting when used with a configured backend

## Requirements

- [Node.js](https://nodejs.org/) 22 or newer
- npm 10 or newer
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for the automatic local MySQL setup
- A browser with WebGPU support for replay playback

The public frontend can run without database credentials. Running the complete backend requires MySQL, Strafes API access, and Roblox OAuth credentials.

## Run the public frontend locally

This is the quickest way to work on the design. In development, Vite proxies public `/api` requests to the original Strafes API.

```bash
git clone https://github.com/plusbyminuss-coder/epicstrafe.git
cd epicstrafe
npm install
npm run build:shared
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000).

To use a different API backend, copy [`client/.env.example`](client/.env.example) to `client/.env.local` and update `VITE_API_PROXY_TARGET`.

## Run the complete stack locally

The complete backend provides same-origin Roblox OAuth, account settings, tier voting, replay view tracking, and the private database-backed API.

1. Start the included MySQL 8.4 container. It automatically creates `strafes_auth_users`, `strafes_globals`, the `epicstrafe` development user, and every required table:

   ```bash
   npm run db:up
   ```

2. Copy `.env.example` to `.env`. The template already contains the matching safe local database credentials.
3. Add your Strafes API key, Roblox OAuth client ID/secret, and a new cookie secret to `.env`.
4. Seed `strafes_globals` with [`fiveman1/strafes-globals-db`](https://github.com/fiveman1/strafes-globals-db) using the same database credentials. Run its `npm run dev-seed` command once, then schedule its normal refresh command hourly if you operate an independent backend.
5. Point `client/.env.local` at the local backend:

   ```env
   VITE_API_PROXY_TARGET=http://localhost:8080
   ```

6. Start all workspaces:

   ```bash
   npm run dev
   ```

Never commit `.env` or real credentials.

### Local database commands

```bash
npm run db:up     # Start MySQL and initialize missing schemas
npm run db:logs   # Follow MySQL logs
npm run db:down   # Stop MySQL while preserving its data volume
```

To completely reset local database data, run `docker compose down -v` and then `npm run db:up`. This permanently removes the local Docker volume.

## Roblox OAuth setup

Create an OAuth application in the [Roblox Creator Dashboard](https://create.roblox.com/dashboard/credentials) and use the `openid profile` scopes.

Configure these redirect URIs exactly:

- Local backend: `http://localhost:8080/oauth/callback`
- Production: `https://your-domain.example/oauth/callback`

Then configure:

```env
ROBLOX_CLIENT_ID=your_client_id
ROBLOX_CLIENT_SECRET=your_client_secret
BASE_URL=https://your-domain.example
COOKIE_SECRET=a_long_random_secret
```

`BASE_URL` must match the origin registered with Roblox. OAuth cookies are domain-bound, so a frontend-only preview cannot authenticate against another domain's backend. See Roblox's [Open Cloud authentication documentation](https://create.roblox.com/docs/cloud/authentication) for current platform guidance.

## Deploy a frontend preview to Vercel

The included [`vercel.json`](vercel.json) builds the React client, preserves SPA routes, and proxies public API requests to the original Strafes API.

1. Import the GitHub repository into [Vercel](https://vercel.com/new).
2. Keep the repository root as the project root.
3. Vercel will use the included build and output settings.
4. Add this public build variable in the Vercel project settings:

   ```env
   VITE_EXTERNAL_AUTH_ORIGIN=https://strafes.fiveman1.net
   ```

This frontend-only deployment supports public data and replays. Its Login button hands off to the original domain because OAuth sessions cannot be shared across domains.

For independent OAuth and account features, deploy the Express backend with both MySQL databases on a persistent Node.js host, point the frontend `/api` route at that backend, remove `VITE_EXTERNAL_AUTH_ORIGIN`, and register your own production callback URL with Roblox. The current backend expects persistent database connections and is not packaged as a Vercel Serverless Function.

Hosted MySQL services can be configured with `DB_HOST` and `DB_PORT`; both required databases must exist on that server and the configured users must have access to them.

See Vercel's documentation for [monorepos](https://vercel.com/docs/monorepos), [build configuration](https://vercel.com/docs/deployments/configure-a-build), and [environment variables](https://vercel.com/docs/environment-variables).

## Commands

```bash
npm run dev             # Shared package, frontend, and backend
npm run dev:frontend    # Frontend only
npm run dev:backend     # Backend only; requires .env
npm run build           # Build every workspace
npm run build:frontend  # Build shared package and frontend
npm run db:up           # Start the provisioned local MySQL service
npm run db:down         # Stop local MySQL and retain its data
npm run start           # Start the production Express server
```

## Contributing

Issues and pull requests are welcome. Install dependencies with `npm install`, keep changes focused, and run `npm run lint` and `npm run build` before submitting. Do not commit credentials, `.env` files, databases, generated builds, or dependency folders.

For security issues involving authentication, credentials, cookies, or databases, contact the repository owner privately rather than opening a public issue. Never include live secrets in a report.

## Credits and license

- Original project: [fiveman1/strafes-site](https://github.com/fiveman1/strafes-site)
- Interface redesign and replay reliability improvements: **@quadrics on Discord**

Released under the [MIT License](LICENSE). The original copyright notice is preserved.
