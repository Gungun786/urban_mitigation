# Heat Backend Proxy

This minimal Express proxy exchanges an IBM Cloud API key for an IAM token and forwards requests to your Watsonx deployment.

Usage:

1. Copy `.env.example` to `.env` and fill values (set `IBM_API_KEY`).

2. Install and run:

```bash
cd server
npm install
npm start
```

3. Frontend can POST to `http://localhost:5200/api/ai-heat-score` with body `{ messages: [...] }`.

Streaming endpoint available at `/api/ai-heat-score-stream`.
