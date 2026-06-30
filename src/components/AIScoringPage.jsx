import React from 'react';
import { Cpu, ShieldCheck, Globe, Star, AlertTriangle, MapPin } from 'lucide-react';
import HeatMap from './HeatMap';

const riskLevels = [
  { label: 'Low', color: 'var(--color-cool)', score: 18 },
  { label: 'Moderate', color: 'var(--color-blue)', score: 45 },
  { label: 'High', color: 'var(--color-warm)', score: 72 },
  { label: 'Critical', color: 'var(--color-vulnerable)', score: 89 },
];

export default function AIScoringPage({
  wards,
  selectedWardId,
  selectedWard,
  onSelectWard,
  activeLayer,
}) {
  const ward = selectedWard || wards[0];
  const score = Math.min(100, Math.round((ward.currentTemp - 28) * 2.3 + (ward.vulnerability * 0.15)));
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
              <strong>{ward.currentTemp.toFixed(1)}°C</strong>
            </div>
            <div>
              <span>Vulnerability</span>
              <strong>{ward.vulnerability.toFixed(0)} / 100</strong>
            </div>
            <div>
              <span>Canopy Cover</span>
              <strong>{ward.canopy.toFixed(1)}%</strong>
            </div>
          </div>
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
            <HeatMap
              wards={wards}
              selectedWardId={selectedWardId}
              onSelectWard={onSelectWard}
              activeLayer={activeLayer}
            />
          </div>
        </div>

        <div className="panel-card">
          <div className="card-title">
            <MapPin size={16} />
            Score Logic
          </div>
          <p className="panel-copy">
            AI scoring blends thermal conditions, social vulnerability, and green cover to recommend the most urgent interventions.
          </p>
        </div>
      </section>
    </main>
  );
}
