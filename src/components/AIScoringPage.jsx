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
  const [dataRegion, setDataRegion] = useState(regionOptions[0] || '');
  const [stateInput, setStateInput] = useState(regionOptions[0] || '');
  const selectedRegion = useMemo(
    () => LOCATION_REGIONS.find((region) => region.name.toLowerCase() === dataRegion.trim().toLowerCase()),
    [dataRegion]
  );
  useEffect(() => {
    if (selectedRegion) {
      setStateInput(selectedRegion.name);
    }
  }, [selectedRegion]);
  const ward = selectedWard || wards[0];
  const locationTarget = selectedRegion || ward;
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastSelected, setLastSelected] = useState(ward);

  useEffect(() => {
    if (ward) setLastSelected(ward);
  }, [ward]);

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
          <p className="panel-copy">{recommendation}</p>
          <div className="recommendation-list">
            <div>
              <Star size={14} />
              <span>Increase shade coverage in high-use streets.</span>
            </div>
            <div>
              <AlertTriangle size={14} />
              <span>Deploy cooling centers and hydration stations during peak heat.</span>
            </div>
            <div>
              <Globe size={14} />
              <span>Promote reflective materials on public buildings and pavements.</span>
            </div>
          </div>
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
              {selectedRegion ? (
                <>
                  <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{selectedRegion.name}</div>
                  <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.9rem' }}>
                    <div>Temp: {selectedRegion.currentTemp.toFixed(1)}°C</div>
                    <div>Vulnerability: {selectedRegion.vulnerability.toFixed(0)} / 100</div>
                    <div>Canopy: {selectedRegion.canopy.toFixed(1)}%</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>AI will use this state/region profile when scoring.</div>
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--muted)' }}>
                  No supported region found for "{dataRegion}". Select a listed state or city and then run AI scoring.
                </div>
              )}
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
                {regionOptions.map((regionName) => (
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
  try {
    // common IBM granite chat response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content || JSON.stringify(data.choices[0].message, null, 2);
    }

    // older format: an array output
    if (data.output && Array.isArray(data.output) && data.output[0] && data.output[0].content) {
      return data.output[0].content;
    }

    // fallback to a readable JSON
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return String(e);
  }
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
