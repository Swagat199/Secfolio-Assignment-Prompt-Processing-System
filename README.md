# Prompt Processing System

A runnable student project for an AI prompt-processing backend that:

- accepts prompts via REST API
- queues jobs for parallel processing
- respects a global provider rate limit of 300 requests/minute
- uses semantic caching to avoid repeated LLM calls
- survives worker crashes using BullMQ + Redis durable jobs

## Tech stack

- Node.js + Express
- BullMQ + Redis
- MongoDB + Mongoose
- Mock LLM provider (default, so it runs without API keys)

## Features mapped to the assignment

### 1) Accepts prompt requests via REST API
- `POST /api/prompts`
- `GET /api/prompts/:id`
- `GET /api/metrics`
- `GET /health`

### 2) Queues and processes them in parallel with durable execution
- jobs are stored in Redis using BullMQ
- worker runs with configurable concurrency
- unfinished jobs stay in the queue if worker crashes

### 3) Respects strict provider rate limits (300 requests/minute)
- shared Redis token-bucket style limiter using minute windows
- enforced inside the worker before calling the provider

### 4) Uses semantic caching
- prompt text is converted to a deterministic mock embedding
- cosine similarity is used against saved cache entries
- if similarity is above threshold, cached response is returned immediately

### 5) Recovers gracefully from worker crashes
- queue jobs use retries with exponential backoff
- worker is stateless and can be restarted safely

## Quick start

### Option A: Run with local MongoDB + Redis already installed

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start API server:
   ```bash
   npm run dev
   ```
4. In another terminal, start worker:
   ```bash
   npm run worker
   ```

### Option B: Run MongoDB + Redis with Docker

1. Start services:
   ```bash
   docker compose up -d
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
   On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start server and worker in separate terminals:
   ```bash
   npm run dev
   npm run worker
   ```

## API examples

### Submit a prompt
```http
POST /api/prompts
Content-Type: application/json

{
  "prompt": "Explain the event loop in Node.js"
}
```

Possible response on cache miss:
```json
{
  "message": "Prompt queued successfully",
  "jobId": "...",
  "status": "queued",
  "cacheHit": false
}
```

Possible response on cache hit:
```json
{
  "message": "Served from semantic cache",
  "jobId": "...",
  "status": "completed",
  "cacheHit": true,
  "response": "..."
}
```

### Check status
```http
GET /api/prompts/:id
```

### Get metrics
```http
GET /api/metrics
```

## Suggested demo flow

1. Submit 5-10 prompts quickly using Postman.
2. Show that jobs enter `queued` and then `processing` / `completed`.
3. Submit a similar prompt again to show cache hit.
4. Stop the worker during processing and restart it to show recovery.
5. Explain that provider calls are rate-limited globally by Redis.

## Project structure

```text
src/
  config/
  controllers/
  models/
  queue/
  routes/
  services/
  utils/
```

## Notes

- Default mode uses a mock provider so the project runs immediately.
- You can later replace `llmService.js` with a real OpenAI-compatible call.
