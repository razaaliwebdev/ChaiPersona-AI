# ChaiPersona Server

Express backend for **ChaiPersona** — an AI chat app where users learn from programming mentors inspired by the public teaching styles of Hitesh Choudhary and Piyush Garg.

The AI is transparent that it is an assistant inspired by public content. It never impersonates these individuals.

---

## Quick Start

```bash
cd server
npm install
cp .env.example .env   # or edit .env directly
# Set OPENAI_API_KEY in .env
npm run dev
```

Server runs at `http://localhost:3000`

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | HTTP server port |
| `NODE_ENV` | No | `development` | Environment (`development` enables debug logs) |
| `CLIENT_URL` | No | `http://localhost:5173` | CORS origin for React client |
| `OPENAI_API_KEY` | Yes (chat) | — | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4.1` | Model for chat completions (`gpt-4.1`, `gpt-5`, etc.) |
| `YOUTUBE_API_KEY` | Yes (collectors) | — | YouTube Data API v3 key for persona collection |

---

## API

### Health Check

```
GET /health
```

```json
{ "success": true, "message": "Server is Healthy..." }
```

### Chat

```
POST /api/chat
```

**Request:**

```json
{
  "personaId": "hitesh",
  "messages": [
    { "role": "user", "content": "Explain Node.js" }
  ]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "reply": "..."
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "VALIDATION_ERROR"
}
```

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `INVALID_PERSONA` | 400 | Unknown personaId |
| `MISSING_API_KEY` | 503 | OpenAI key not configured |
| `RATE_LIMIT` | 429 | OpenAI rate limit hit |
| `AI_PROVIDER_ERROR` | 502 | OpenAI request failed |
| `INVALID_AI_RESPONSE` | 502 | Empty AI response |
| `NOT_FOUND` | 404 | Unknown route |

**Supported personas:** `hitesh`, `piyush`

**Message rules:**
- `messages` must be a non-empty array
- Each message needs `role` (`user` | `assistant`) and non-empty `content`
- Last message must be from `user`
- Server is stateless — client sends full conversation history

---

## Architecture

```
Request
  → Route (chat.route.js)
  → Controller (chat.controller.js)     — validation only
  → Service (ai.service.js)             — OpenAI call
  → Builder (prompts/builder.js)      — assembles messages
  → OpenAI Chat Completions API
```

### Layers

| Layer | Path | Responsibility |
|-------|------|----------------|
| Routes | `src/routes/` | HTTP routing |
| Controllers | `src/controllers/` | Request validation, response formatting |
| Services | `src/services/` | Business logic, external API calls |
| Prompts | `src/prompts/` | Persona registry, prompt builder |
| Collectors | `src/collectors/` | Offline data collection pipeline |
| Middleware | `src/middleware/` | Global error handling |
| Utils | `src/utils/` | Logger, validation, errors, constants |

---

## Folder Structure

```
server/
├── data/
│   └── personas/           # Collected persona JSON (used by prompt builder)
│       ├── hitesh.json
│       └── piyush.json
├── scripts/
│   └── buildPersona.js     # CLI to run collection pipeline
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── ai.js           # OpenAI client
│   ├── controllers/
│   │   └── chat.controller.js
│   ├── routes/
│   │   └── chat.route.js
│   ├── services/
│   │   └── ai.service.js
│   ├── prompts/
│   │   ├── index.js        # PERSONAS registry + getPersona()
│   │   ├── builder.js      # Builds OpenAI messages array
│   │   └── personas/
│   │       ├── hitesh/     # data.js, prompt.js, examples.js, index.js
│   │       └── piyush/
│   ├── collectors/
│   │   ├── youtube/        # YouTube Data API + transcript extraction
│   │   ├── website/        # Public website/blog scraping
│   │   └── personas/       # Orchestrates collection → JSON output
│   ├── middleware/
│   │   └── error.middleware.js
│   └── utils/
│       ├── logger.js
│       ├── validation.js
│       ├── errors.js
│       └── constants.js
└── package.json
```

---

## Prompt Engineering

Each persona has three components:

1. **System prompt** (`prompt.js`) — role, teaching philosophy, communication style, safety rules
2. **Few-shot examples** (`examples.js`) — Q&A pairs that steer response style
3. **Metadata** (`data.js`) — expertise, sources, personality traits

The **prompt builder** assembles the final OpenAI messages array:

```
[System prompt + optional collected notes]
→ [Few-shot example pairs]
→ [Conversation history (last 20 messages)]
```

Collected persona notes from `data/personas/{id}.json` are appended to the system prompt when available. This data comes from the offline collection pipeline — never fetched during chat requests.

### Personas

| Persona | Style | Audience |
|---------|-------|----------|
| **Hitesh** | Warm, beginner-friendly, project-first, occasional Hinglish | Beginner → Intermediate |
| **Piyush** | Architecture-first, production-minded, trade-off analysis | Intermediate → Advanced |

---

## Context Management

- Client owns conversation history
- Server is fully stateless
- History is sanitized (only `user`/`assistant` roles, trimmed content)
- Limited to last **20 messages** to control token usage
- Few-shot examples are always included (not counted against history limit)

---

## Persona Data Collection

Offline pipeline — not called during chat requests.

### YouTube Pipeline

```
Channel URL
  → Resolve channel ID (YouTube Data API)
  → Fetch videos + playlists
  → Fetch video metadata
  → Extract transcripts (youtube-transcript)
  → Detect teaching patterns
  → Save to data/personas/{id}.json
```

### Website Pipeline

```
Website URL
  → Fetch main page + blog/tutorial links
  → Extract headings, topics, terminology
  → Analyze writing style
  → Merge into persona JSON
```

### Run Collection

```bash
# Requires YOUTUBE_API_KEY in .env
npm run build:persona -- hitesh
npm run build:persona -- piyush
npm run build:persona -- hitesh 15   # fetch up to 15 videos per channel
```

Output: `data/personas/{personaId}.json` with topics, terminology, teaching patterns, and writing style notes.

---

## Client Integration

The React client calls `POST /api/chat` via `client/src/services/api.js`.

Set `VITE_API_URL` in the client if the server is not at `http://localhost:3000`.

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start production server |
| `npm run build:persona -- <id>` | Run persona collection pipeline |

---

## Logging

Development-only info/debug logs via `src/utils/logger.js`. Errors always log regardless of environment.
