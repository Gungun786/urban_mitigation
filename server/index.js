const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5200;
const IBM_API_KEY = process.env.IBM_API_KEY;
const IBM_PRIVATE_ENDPOINT = process.env.IBM_PRIVATE_ENDPOINT || 'https://private.eu-de.ml.cloud.ibm.com';
const IBM_PUBLIC_ENDPOINT = process.env.IBM_PUBLIC_ENDPOINT || 'https://eu-de.ml.cloud.ibm.com';
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;
const API_VERSION = process.env.API_VERSION || '2021-05-01';

if (!IBM_API_KEY) {
  console.warn('Warning: IBM_API_KEY not set. Set it in .env for production use.');
}

// Helper: exchange apikey for IAM token
async function getIamToken() {
  if (!IBM_API_KEY) throw new Error('IBM_API_KEY missing');
  const tokenUrl = 'https://iam.cloud.ibm.com/identity/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
  params.append('apikey', IBM_API_KEY);

  const resp = await axios.post(tokenUrl, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
  });

  return resp.data.access_token;
}

// Proxy endpoint: /api/ai-heat-score
app.post('/api/ai-heat-score', async (req, res) => {
  try {
    const payload = req.body;
    // Validate basic structure
    if (!payload || !payload.messages) return res.status(400).json({ error: 'Invalid payload; expected { messages: [...] }' });

    const iam = await getIamToken();

    // Try private endpoint first (if configured), otherwise fall back to public endpoint
    const endpoints = [];
    if (IBM_PRIVATE_ENDPOINT) endpoints.push(IBM_PRIVATE_ENDPOINT);
    if (IBM_PUBLIC_ENDPOINT) endpoints.push(IBM_PUBLIC_ENDPOINT);

    let lastErr = null;
    for (const base of endpoints) {
      const url = `${base}/ml/v1/deployments/${DEPLOYMENT_ID}/text/chat?version=${API_VERSION}`;
      try {
        const r = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${iam}`
          },
          httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
          timeout: 20000,
        });
        return res.json(r.data);
      } catch (err) {
        console.warn(`Watsonx request to ${base} failed:`, err.code || err.message || err);
        lastErr = err;
        // try next endpoint
      }
    }

    // If we reach here, all endpoints failed
    throw lastErr || new Error('No Watsonx endpoints available');
  } catch (err) {
    console.error('Error calling Watsonx:', err?.response?.data || err.message || err);
    const status = err?.response?.status || 500;
    return res.status(status).json({ error: err?.response?.data || err.message });
  }
});

// Streaming proxy (simple forwarding; client must handle server-sent chunking)
app.post('/api/ai-heat-score-stream', async (req, res) => {
  try {
    const payload = req.body;
    const iam = await getIamToken();
    const base = IBM_PRIVATE_ENDPOINT || IBM_PUBLIC_ENDPOINT;
    const url = `${base}/ml/v1/deployments/${DEPLOYMENT_ID}/text/chat_stream?version=${API_VERSION}`;

    const r = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${iam}`
      },
      responseType: 'stream',
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });

    // Pipe response stream back to client
    res.setHeader('Content-Type', 'application/octet-stream');
    r.data.pipe(res);
  } catch (err) {
    console.error('Streaming error:', err?.response?.data || err.message || err);
    return res.status(500).json({ error: err?.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Heat backend running on http://localhost:${PORT}`);
});
