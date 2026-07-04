import React, { useState, useEffect, useMemo } from 'react';
import { Cpu, ShieldCheck, Globe, Star, AlertTriangle, MapPin } from 'lucide-react';
import HeatMap from './HeatMap';
import { fetchAIHeatScore } from '../lib/watsonx';
import { LOCATION_REGIONS } from '../data/locationRegions';

const riskLevels = [
  { label: 'Low', color: 'var(--color-cool)', score: 18 },
  { label: 'Moderate', color: 'var(--color-blue)', score: 45 },
  { label: 'High', color: 'var(--color-warm)', score: 72 },
  { label: 'Critical', color: 'var(--color-vulnerable)', score: 89 },
];

const ALL_INDIA_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

function buildFallbackStateProfile(name) {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  const hotStates = ['rajasthan', 'gujarat', 'punjab', 'haryana', 'delhi', 'uttar pradesh', 'madhya pradesh', 'chhattisgarh', 'bihar'];
  const warmStates = ['maharashtra', 'odisha', 'west bengal', 'telangana', 'andhra pradesh', 'karnataka', 'tamil nadu', 'kerala'];
  const coolStates = ['assam', 'meghalaya', 'nagaland', 'manipur', 'mizoram', 'tripura', 'sikkim', 'arunachal pradesh', 'himachal pradesh', 'jammu and kashmir', 'ladakh'];
  const islandStates = ['goa', 'andaman and nicobar islands', 'lakshadweep', 'puducherry', 'chandigarh', 'daman and diu', 'dadra and nagar haveli and daman and diu'];

  let profile = { currentTemp: 33.5, vulnerability: 55, canopy: 22, albedo: 0.24, priority: 'Medium' };

  if (hotStates.includes(normalized)) {
    profile = { currentTemp: 36.5, vulnerability: 62, canopy: 18, albedo: 0.22, priority: 'High' };
  } else if (warmStates.includes(normalized)) {
    profile = { currentTemp: 34.5, vulnerability: 58, canopy: 24, albedo: 0.23, priority: 'Medium' };
  } else if (coolStates.includes(normalized)) {
    profile = { currentTemp: 30.5, vulnerability: 50, canopy: 32, albedo: 0.26, priority: 'Low' };
  } else if (islandStates.includes(normalized)) {
    profile = { currentTemp: 32.5, vulnerability: 52, canopy: 29, albedo: 0.25, priority: 'Medium' };
  }

  return {
    id: normalized.replace(/\s+/g, '-'),
    name,
    currentTemp: profile.currentTemp,
    vulnerability: profile.vulnerability,
    canopy: profile.canopy,
    albedo: profile.albedo,
    priority: profile.priority,
    description: `Generic statewide heat profile for ${name}. Exact local data may not be available, but this profile supports AI scoring for all states.`,
    region: name,
  };
}

function AIScoreFetcher({ city = 'Delhi', ward, onResult }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ward) fetchScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ward]);

  async function fetchScore() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAIHeatScore({ city, ward });
      setResult(data);
      if (typeof onResult === 'function') onResult(data);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '0.8rem' }}>
      <button className="action-btn" onClick={fetchScore} disabled={loading}>
        {loading ? 'Fetching AI Score...' : 'Get AI Heat Score'}
      </button>
      {error && <div style={{ color: 'var(--color-heat)', marginTop: '0.6rem' }}>{error}</div>}

      {result && (
        <div style={{ marginTop: '0.6rem', background: 'var(--bg-card)', padding: '0.6rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>AI Response</div>
          <div style={{ maxHeight: '220px', overflow: 'auto', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{renderAIText(result)}</div>

          <div style={{ fontSize: '0.8rem', marginTop: '0.6rem', color: 'var(--muted)' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Why this response?</div>
            <div>{computeRationale(ward)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIScoringPage({ wards, selectedWardId, selectedWard, onSelectWard, activeLayer, city = 'Delhi' }) {
  const regionOptions = useMemo(() => LOCATION_REGIONS.map(region => region.name), []);
  const [dataRegion, setDataRegion] = useState(regionOptions[0] || ALL_INDIA_STATES[0]);
  const [stateInput, setStateInput] = useState(regionOptions[0] || ALL_INDIA_STATES[0]);
  const matchedRegion = useMemo(
    () => LOCATION_REGIONS.find((region) => region.name.toLowerCase() === dataRegion.trim().toLowerCase()),
    [dataRegion]
  );
  const selectedRegion = useMemo(
    () => matchedRegion || buildFallbackStateProfile(dataRegion),
    [matchedRegion, dataRegion]
  );
  useEffect(() => {
    if (matchedRegion) {
      setStateInput(matchedRegion.name);
    }
  }, [matchedRegion]);
  const ward = selectedWard || wards[0];
  const locationTarget = selectedRegion || ward;
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastSelected, setLastSelected] = useState(ward);

  useEffect(() => {
    if (ward) setLastSelected(ward);
  }, [ward]);

  useEffect(() => {
    setAiResult(null);
  }, [dataRegion, ward?.id]);

  const parsedAI = useMemo(() => parseAIResponse(aiResult), [aiResult]);
  const displayedRecommendations = parsedAI.recommendations.length
    ? parsedAI.recommendations
    : buildLocalRecommendations(locationTarget);

  useEffect(() => {
    if (selectedWardId && wards) {
      const selected = wards.find((w) => w.id === selectedWardId);
      if (selected) setLastSelected(selected);
    }
  }, [selectedWardId, wards]);

  const score = Math.min(100, Math.round((locationTarget.currentTemp - 28) * 2.3 + locationTarget.vulnerability * 0.15));
  const recommendation =
    score >= 80
      ? 'Immediate cooling support is recommended with shade, water features, and cool surfaces in community spaces.'
      : score >= 60
      ? 'Elevate canopy cover and reflective roofs to reduce local heat burden and protect people outdoors.'
      : 'Continue active cooling measures with targeted shading and heat awareness for at-risk groups.';

  return (
    <main className="ai-grid">
      <section className="dashboard-panel">
        <div className="panel-card">
          <div className="card-title">
            <Cpu size={16} />
            AI Heat Score
          </div>

          <p className="panel-copy">
            The AI score combines temperature, vulnerability, canopy cover, and urban density to highlight priority action areas.
          </p>

          <div className="score-card" style={{ borderColor: score > 80 ? 'var(--color-vulnerable)' : score > 60 ? 'var(--color-blue)' : 'var(--color-cool)' }}>
            <strong>{score}</strong>
            <span>{score >= 80 ? 'Critical Heat Risk' : score >= 60 ? 'High Heat Risk' : 'Moderate Heat Risk'}</span>
          </div>

          <div className="ai-metrics">
            <div>
              <span>Current Temp</span>
              <strong>{locationTarget.currentTemp.toFixed(1)}°C</strong>
            </div>
            <div>
              <span>Vulnerability</span>
              <strong>{locationTarget.vulnerability.toFixed(0)} / 100</strong>
            </div>
            <div>
              <span>Canopy Cover</span>
              <strong>{locationTarget.canopy.toFixed(1)}%</strong>
            </div>
          </div>

          {/* Pick Location moved to the India Heat Map panel on the right */}

          <AIScoreFetcher city={locationTarget.name} ward={locationTarget} />
        </div>

        <div className="panel-card">
          <div className="card-title">
            <ShieldCheck size={16} />
            AI Recommendations
          </div>
          <p className="panel-copy">
            Recommendations tailored to the selected state or city heat profile.
          </p>
          <ul className="recommendation-list">
            {displayedRecommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dashboard-panel right">
        <div className="panel-card small-map-card">
          <div className="card-title">
            <Globe size={16} />
            India Heat Map
          </div>
          <div className="forecast-map-wrapper">
            <HeatMap wards={wards} selectedWardId={selectedWardId} onSelectWard={onSelectWard} activeLayer={activeLayer} />
          </div>

          <div style={{ padding: '0.6rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Selected Area</div>
            <div style={{
              marginTop: '0.4rem',
              background: selectedRegion ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
              border: selectedRegion ? '1px solid rgba(255, 255, 255, 0.18)' : '1px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: 10,
              padding: '0.65rem'
            }}>
                <>
                <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{selectedRegion.name}</div>
                <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.9rem' }}>
                  <div>Temp: {selectedRegion.currentTemp.toFixed(1)}°C</div>
                  <div>Vulnerability: {selectedRegion.vulnerability.toFixed(0)} / 100</div>
                  <div>Canopy: {selectedRegion.canopy.toFixed(1)}%</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {matchedRegion
                      ? 'AI will use this state/region profile when scoring.'
                      : `Using a generic fallback profile for ${selectedRegion.name}. Exact local values may not be available.`}
                  </div>
                </div>
              </>
            </div>

            <div style={{ marginTop: '0.6rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Choose region</div>
              <select
                className="location-select"
                value={stateInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setStateInput(value);
                  setDataRegion(value);
                }}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 8, border: '1px solid var(--muted)', background: 'var(--bg-panel)' }}
              >
                {ALL_INDIA_STATES.map((regionName) => (
                  <option key={regionName} value={regionName}>{regionName}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '0.6rem' }}>
              <button
                className="action-btn"
                onClick={async () => {
                  if (!selectedRegion) return;
                  setAiLoading(true);
                  setAiResult(null);
                  try {
                    const targetWard = {
                      name: selectedRegion.name,
                      currentTemp: selectedRegion.currentTemp,
                      canopy: selectedRegion.canopy,
                      vulnerability: selectedRegion.vulnerability,
                      albedo: selectedRegion.albedo,
                      priority: selectedRegion.priority,
                      description: selectedRegion.description
                    };
                    const data = await fetchAIHeatScore({ city: selectedRegion.name, ward: targetWard });
                    setAiResult(data);
                  } catch (e) {
                    setAiResult({ error: e.message || String(e) });
                  } finally {
                    setAiLoading(false);
                  }
                }}
                disabled={aiLoading || !selectedRegion}
              >
                {aiLoading ? 'Checking…' : 'Check AI Heat Score'}
              </button>
            </div>

            {aiResult && (
              <div style={{ marginTop: '0.6rem', background: 'var(--bg-card)', padding: '0.6rem', borderRadius: 8 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Explanation</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>
                  {renderAIText(aiResult)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="panel-card">
          <div className="card-title">
            <MapPin size={16} />
            Score Logic
          </div>
          <p className="panel-copy">AI scoring blends thermal conditions, social vulnerability, and green cover to recommend the most urgent interventions.</p>
        </div>
      </section>
    </main>
  );
}

// Helper to extract assistant text from different Watsonx response shapes
function renderAIText(data) {
  if (!data) return null;
  const text = extractResponseText(data);
  if (!text) return null;
  const { analysis, recommendations } = parseAIResponse(data);

  return (
    <>
      {analysis.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Analysis</div>
          <ol style={{ marginLeft: '1.1rem', paddingLeft: '0.2rem' }}>
            {analysis.map((item, idx) => (
              <li key={`analysis-${idx}`}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {recommendations.length > 0 ? (
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Recommendations</div>
          <ul style={{ marginLeft: '1.1rem', paddingLeft: '0.2rem' }}>
            {recommendations.map((item, idx) => (
              <li key={`rec-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{text}</p>
      )}
    </>
  );
}

function extractResponseText(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content || '';
  }
  if (data.output && Array.isArray(data.output) && data.output[0] && data.output[0].content) {
    return data.output[0].content;
  }
  if (data.error) return data.error;
  return JSON.stringify(data, null, 2);
}

function parseAIResponse(data) {
  const text = extractResponseText(data);
  if (!text) return { analysis: [], recommendations: [] };

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const analysis = [];
  const recommendations = [];
  let currentSection = 'analysis';

  for (const line of lines) {
    if (/^recommendations?:/i.test(line)) {
      currentSection = 'recommendations';
      continue;
    }

    const numberedMatch = line.match(/^\d+\.\s*(.*)$/);
    const bulletMatch = line.match(/^[-*]\s*(.*)$/);

    if (numberedMatch) {
      analysis.push(numberedMatch[1].trim());
      continue;
    }

    if (bulletMatch) {
      recommendations.push(bulletMatch[1].trim());
      continue;
    }

    if (currentSection === 'recommendations') {
      if (recommendations.length > 0) {
        recommendations[recommendations.length - 1] += ' ' + line;
      }
    } else {
      if (analysis.length > 0) {
        analysis[analysis.length - 1] += ' ' + line;
      }
    }
  }

  return { analysis, recommendations };
}

function buildLocalRecommendations(target) {
  if (!target) return [];
  const rec = [];
  const temp = target.currentTemp;
  const vulnerability = target.vulnerability;
  const canopy = target.canopy;
  const albedo = target.albedo;

  if (temp >= 35) {
    rec.push(`Lower daytime heat by adding shade, water points, and reflective roofs in ${target.name}.`);
  } else if (temp >= 32) {
    rec.push(`Strengthen passive cooling in ${target.name} with more trees and shaded walkways.`);
  } else {
    rec.push(`Keep monitoring local heat and maintain cooling measures in ${target.name}.`);
  }

  if (canopy < 25) {
    rec.push('Increase canopy cover with street trees, parks, and green community spaces.');
  }

  if (vulnerability >= 60) {
    rec.push('Prioritize cooling centers, hydration, and outreach for vulnerable communities.');
  }

  if (albedo < 0.22) {
    rec.push('Use reflective surfaces on roofs and pavements to reduce surface heating.');
  }

  if (rec.length === 0) {
    rec.push('Apply targeted shading, water access, and awareness campaigns to keep heat risk low.');
  }

  return rec;
}

function computeRationale(ward) {
  if (!ward) return 'No ward data available.';
  const parts = [];
  const t = ward.currentTemp;
  if (t >= 42) parts.push(`Extremely high surface temperature (${t.toFixed(1)}°C) strongly increases heat risk.`);
  else if (t >= 39) parts.push(`High surface temperature (${t.toFixed(1)}°C) contributes to elevated heat exposure.`);
  else if (t >= 36) parts.push(`Moderately high surface temperature (${t.toFixed(1)}°C) adds to local heat burden.`);
  else parts.push(`Surface temperature (${t.toFixed(1)}°C) is not extreme.`);

  if (ward.vulnerability >= 75) parts.push(`Very high social vulnerability (${ward.vulnerability}/100) increases potential harm.`);
  else if (ward.vulnerability >= 50) parts.push(`Moderate vulnerability (${ward.vulnerability}/100) increases concern.`);
  else parts.push(`Lower vulnerability (${ward.vulnerability}/100) reduces immediate population risk.`);

  if (ward.canopy <= 10) parts.push(`Low canopy cover (${ward.canopy.toFixed(1)}%) reduces cooling and shading.`);
  else if (ward.canopy <= 30) parts.push(`Moderate canopy (${ward.canopy.toFixed(1)}%) provides some cooling.`);
  else parts.push(`Good canopy cover (${ward.canopy.toFixed(1)}%) helps mitigate heat locally.`);

  if (ward.albedo && ward.albedo > 0.2) parts.push(`Higher albedo (${ward.albedo}) indicates reflective surfaces which can increase daytime heating of nearby areas.`);

  return parts.join(' ');
}
