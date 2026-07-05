# ChaiPersona

AI chat application with programming mentors inspired by the public teaching styles of **Hitesh Choudhary** and **Piyush Garg**.

The project is deployed as **two independent services** — a Vite + React client and an Express API server.

---

## Project Structure

```text
chai-persona/
├── client/          # Vite + React frontend
├── server/          # Express + OpenAI backend
├── package.json     # Root scripts (local dev convenience)
└── README.md
```

---

## Local Development

### Option A — Run both from root

```bash
npm install
npm run install:all
npm run dev
```

- Client → http://localhost:5173
- Server → http://localhost:3000

### Option B — Run separately

**Server**

```bash
cd server
cp .env.example .env
# Add OPENAI_API_KEY
npm install
npm run dev
```

**Client**

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

In development, leave `VITE_API_URL` empty — Vite proxies `/api` and `/health` to the server.

---

## Environment Variables

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Production only | Backend base URL (no `/api` suffix). Example: `https://api.yourapp.com` |

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Default `3000` |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_URL` | Yes (prod) | Frontend origin(s) for CORS. Comma-separated if multiple. |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_MODEL` | No | Default `gpt-4.1` |
| `YOUTUBE_API_KEY` | No | Only for persona collection pipeline |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/chat` | Persona-based AI chat |

**Health response:**

```json
{
  "success": true,
  "message": "Server is Healthy"
}
```

---

## Production Deployment (Sevalla)

Deploy as **two separate services**. Do not merge client and server into one process.

### Architecture

```text
Browser
   │
   ├─► Client Service (Vite static build)
   │       https://your-client.sevalla.app
   │
   └─► Server Service (Express API)
           https://your-server.sevalla.app
               ├── GET  /health
               └── POST /api/chat
```

---

### Service 1 — Frontend (Client)

| Setting | Value |
|---------|-------|
| Root directory | `client` |
| Build command | `npm install && npm run build` |
| Start command | `npm run start` |
| Port | Set `PORT` env (default `4173`) |

**Environment variables:**

```env
VITE_API_URL=https://your-server.sevalla.app
PORT=4173
```

> `VITE_API_URL` must be set **at build time** for Vite to embed it. Set it in Sevalla before running `npm run build`.

---

### Service 2 — Backend (Server)

| Setting | Value |
|---------|-------|
| Root directory | `server` |
| Build command | `npm install` |
| Start command | `npm start` |
| Port | Set `PORT` env (default `3000`) |

**Environment variables:**

```env
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-client.sevalla.app
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1
YOUTUBE_API_KEY=...
```

---

### CORS

The server allows requests only from origins listed in `CLIENT_URL`.

In development, `localhost:5173` and `localhost:4173` are automatically allowed.

Set `CLIENT_URL` to your deployed client URL in production:

```env
CLIENT_URL=https://your-client.sevalla.app
```

For multiple origins:

```env
CLIENT_URL=https://app.example.com,https://www.example.com
```

---

## Deployment Checklist

- [ ] Client builds successfully (`cd client && npm run build`)
- [ ] Server starts successfully (`cd server && npm start`)
- [ ] `VITE_API_URL` set at client build time
- [ ] `CLIENT_URL` set on server to match client domain
- [ ] `OPENAI_API_KEY` set on server
- [ ] No `.env` files committed to git
- [ ] `GET /health` returns success on server URL
- [ ] Chat works from deployed client
- [ ] No hardcoded `localhost` in production config

---

## Scripts Reference

### Root

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install client + server dependencies |
| `npm run dev` | Run both in development |
| `npm run build` | Build client for production |
| `npm run start:client` | Serve built client |
| `npm run start:server` | Start API server |

### Client

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run start` | Serve `dist/` (production) |

### Server

| Command | Description |
|---------|-------------|
| `npm run dev` | Nodemon dev server |
| `npm start` | Production server |
| `npm run build:persona` | Offline persona data collection |

---

## Security Notes

- Never commit `.env` files or API keys
- Use Sevalla environment variables for secrets
- CORS is restricted to configured client origins in production
- Development-only logging is disabled when `NODE_ENV=production`

---

See also: [server/README.md](server/README.md) for API and architecture details.
