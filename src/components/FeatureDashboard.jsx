import React from 'react';
import {
  CalendarDays,
  Thermometer,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Layers,
} from 'lucide-react';
import PredictionChart from './PredictionChart';
import HeatMap from './HeatMap';

export default function FeatureDashboard({
  wards,
  selectedWardId,
  selectedWard,
  cityStats,
  onSelectWard,
  activeLayer,
}) {
  const ward = selectedWard || wards[0];
  const topHeatWards = [...wards]
    .sort((a, b) => b.currentTemp - a.currentTemp)
    .slice(0, 3);

  return (
    <main className="forecast-grid">
      <section className="dashboard-panel">
        <div className="panel-card">
          <div className="card-title">
            <Thermometer size={16} />
            Predictive Resilience Dashboard
          </div>
          <p className="panel-copy">
            This predictive capability allows city authorities to prepare mitigation strategies before severe heat events occur, shifting urban planning from reactive to proactive.
          </p>
        </div>

        <div className="panel-card">
          <div className="card-title">
            <CalendarDays size={16} />
            Forecast Output
          </div>
          <ul style={{ marginTop: '0.8rem', paddingLeft: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>Monthly Heat Forecast</li>
            <li>Seasonal Heat Prediction</li>
            <li>Future Risk Maps</li>
            <li>High-Risk Alerts</li>
          </ul>
        </div>

        <div className="panel-card">
          <div className="card-title">
            <ShieldAlert size={16} />
            Risk Summary
          </div>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'grid', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highest Alert Ward</span>
              <strong>{topHeatWards[0]?.name.split(' (')[0]}</strong>
              <span style={{ color: 'var(--text-secondary)' }}>
                {topHeatWards[0]?.currentTemp.toFixed(1)}°C, {topHeatWards[0]?.priority} priority
              </span>
            </div>
            <div style={{ display: 'grid', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected City-wide Peak</span>
              <strong>{cityStats.currentTemp.toFixed(1)}°C</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Avg. across monitored wards</span>
            </div>
            <div style={{ display: 'grid', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Immediate Action</span>
              <strong>{ward.priority === 'High' ? 'Cool roofs & shading' : 'Canopy expansion'}</strong>
              <span style={{ color: 'var(--text-secondary)' }}>
                Focus on areas with low canopy and high vulnerability.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-panel right">
        <div className="panel-card">
          <div className="card-title">
            <TrendingUp size={16} />
            Predictive Trend
          </div>
          <p className="panel-copy">
            Temperature forecast for the selected ward and the estimated cooling impact of mitigation actions.
          </p>
          <PredictionChart selectedWard={ward} cityStats={cityStats} />
        </div>

        <div className="panel-card">
          <div className="card-title">
            <MapPin size={16} />
            Future Risk Map
          </div>
          <p className="panel-copy">
            Select a ward to see how the risk profile changes based on current heat, canopy, and vulnerability data.
          </p>
          <div style={{ minHeight: '260px' }}>
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
            <AlertTriangle size={16} />
            High-Risk Alerts
          </div>
          <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.75rem' }}>
            {topHeatWards.map(wardItem => (
              <div key={wardItem.id} style={{ padding: '0.8rem', borderRadius: '8px', background: 'rgba(255, 153, 51, 0.08)', border: '1px solid rgba(255, 153, 51, 0.16)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <strong>{wardItem.name.split(' (')[0]}</strong>
                  <span style={{ color: 'var(--color-heat)', fontWeight: 700 }}>{wardItem.currentTemp.toFixed(1)}°C</span>
                </div>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  Priority: {wardItem.priority} · Vulnerability {wardItem.vulnerability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
