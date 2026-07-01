// Lightweight helper to call the local Watsonx proxy
export async function fetchAIHeatScore({ city = 'Delhi', ward }) {
  if (!ward) throw new Error('ward is required');

  const content = `You are a heat mitigation analyst. Answer in a pointwise numbered format for the analysis and then provide a separate bulleted recommendation list. Use the provided location data to tailor recommendations specifically to that area.

Location details:
city: ${city}
wardName: ${ward.name}
currentTemp: ${ward.currentTemp}
vulnerability: ${ward.vulnerability}
canopyCover: ${ward.canopy}
albedo: ${ward.albedo}
priority: ${ward.priority}
context: ${ward.description}

Format your response like this:
1. Analysis point one...
2. Analysis point two...

Recommendations:
- Recommendation one
- Recommendation two
`;
  const payload = { messages: [{ role: 'user', content }] };

  const resp = await fetch('/api/ai-heat-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || 'Request failed');
  }

  return resp.json();
}

export default {
  fetchAIHeatScore,
};
