# ChaiPersona — Server Progress

**Status:** Complete and working

---

## What is this?

ChaiPersona is an AI chat app. Users can talk to two programming mentors:

- **Hitesh** — friendly, beginner-friendly style
- **Piyush** — architecture-focused, production-minded style

The server handles AI responses. The React client sends messages and shows replies.

---

## What was already there?

- Basic Express setup
- Hitesh's prompt and examples
- Persona metadata files
- Empty chat route and controller
- Client showing fake/simulated responses

---

## What we built?

### Chat API
- `POST /api/chat` — main endpoint for AI chat
- `GET /health` — check if server is running
- Request validation and proper error messages

### Two Personas
- **Hitesh** — strengthened voice prompt, richer few-shot examples, persona-specific temperature (0.85), voice reminder in builder
- **Piyush** — wrote full system prompt + 8 example Q&As

### Prompt System
- `prompts/builder.js` — combines system prompt, examples, and chat history before sending to OpenAI
- `prompts/index.js` — registry to get persona by ID (`hitesh` or `piyush`)

### AI Service
- `services/ai.service.js` — calls OpenAI and returns the reply
- Model set via `OPENAI_MODEL` in `.env` (default: `gpt-4.1`)

### Data Collectors (optional, offline)
- Fetches public YouTube videos and website content
- Saves persona notes to `data/personas/hitesh.json` and `piyush.json`
- Run with: `npm run build:persona -- hitesh`
- Not used during normal chat — only for enriching prompts

### Client Connected
- `client/src/services/api.js` — calls `POST /api/chat`
- `client/src/hooks/useChat.js` — sends messages to backend, shows AI replies
- `client/src/components/ChatError.jsx` — shows API errors in UI
- Vite dev proxy — `/api` forwards to `localhost:3000`

### Bug Fixes
- Fixed route path (`/api/chat`)
- Fixed broken imports
- Fixed CORS for React client
- Server no longer crashes without API key

---

## How does a chat request work?

```
React Client
    ↓
POST /api/chat
    ↓
Controller (checks request is valid)
    ↓
AI Service (calls OpenAI)
    ↓
Prompt Builder (adds persona style + history)
    ↓
OpenAI returns reply
    ↓
Client shows the message
```

---

## API Example

**Send:**
```json
POST /api/chat

{
  "personaId": "hitesh",
  "messages": [
    { "role": "user", "content": "Explain Node.js" }
  ]
}
```

**Get back:**
```json
{
  "success": true,
  "reply": "..."
}
```

---

## Folder Structure (simple view)

```
server/
├── src/
│   ├── app.js              → Express app setup
│   ├── server.js           → Starts the server
│   ├── routes/             → API routes
│   ├── controllers/        → Handles requests
│   ├── services/           → OpenAI logic
│   ├── prompts/            → Persona prompts + builder
│   ├── collectors/         → YouTube/website data (offline)
│   └── utils/              → Validation, errors, logging
├── data/personas/          → Collected persona JSON files
├── scripts/                → buildPersona CLI
└── .env                    → API keys and config
```

---

## Environment Variables

```env
PORT=3000
OPENAI_API_KEY=           # needed for chat
OPENAI_MODEL=gpt-4.1
CLIENT_URL=http://localhost:5173
YOUTUBE_API_KEY=          # only for persona collection
```

---

## How to Run

```bash
# Server
cd server
npm install
# add OPENAI_API_KEY to .env
npm run dev

# Client (separate terminal)
cd client
npm run dev
```

- Server → http://localhost:3000
- Client → http://localhost:5173

---

## Tested & Working

- Health check returns OK
- Invalid persona returns error
- Missing API key returns clear error message
- Both personas load correctly

---

### Hitesh Persona Voice (July 5, 2026)
- Richer system prompt with teaching rhythm, Hinglish, and Chai aur Code tone
- Expanded few-shot examples with code walkthroughs and warm mentor voice
- Cleaned collected notes in `data/personas/hitesh.json` (removed noisy topics)
- Hitesh uses temperature 0.85; Piyush stays at default 0.7

---

*Last updated: July 5, 2026*
