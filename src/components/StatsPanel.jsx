import React from 'react';
import { 
  Thermometer, 
  ShieldAlert, 
  Trees, 
  Building, 
  Activity, 
  Droplet, 
  Zap, 
  Gauge 
} from 'lucide-react';

export default function StatsPanel({ selectedWard, cityStats }) {
  // Determine if we display ward stats or overall city stats
  const isWardSelected = !!selectedWard;
  const stats = isWardSelected ? selectedWard : cityStats;
  const displayName = isWardSelected ? selectedWard.name : "City-wide Average";

  // Calculate cooling achieved
  const coolingAchieved = isWardSelected 
    ? (selectedWard.baseTemp - selectedWard.currentTemp).toFixed(1)
    : (cityStats.baseTemp - cityStats.currentTemp).toFixed(1);

  // Helper for priority badges
  const renderPriorityBadge = (priority) => {
    if (!priority) return null;
    const badgeClass = priority === 'High' ? 'high' : priority === 'Medium' ? 'medium' : 'low';
    return (
      <span className={`priority-badge ${badgeClass}`}>
        {priority} Priority
      </span>
    );
  };

  return (
    <div className="stats-panel-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Title Card */}
      <div className="panel-card" style={{ borderLeft: isWardSelected ? '3px solid var(--border-active)' : '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {isWardSelected ? 'Selected Ward Focus' : 'System Overview'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginTop: '0.15rem' }}>
              {displayName}
            </h2>
          </div>
          {isWardSelected && renderPriorityBadge(selectedWard.priority)}
        </div>
        {isWardSelected && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {selectedWard.description || "Densely populated region with elevated heat island impact."}
          </p>
        )}
      </div>

      {/* Primary Metrics Grid */}
      <div className="stat-grid">
        {/* Land Surface Temperature */}
        <div className="stat-box hot highlighted" style={{ boxShadow: 'var(--glow-heat)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Thermometer size={12} />
            Land Surface Temp
          </span>
          <h3>{stats.currentTemp.toFixed(1)}°C</h3>
          {coolingAchieved > 0 ? (
            <span style={{ color: 'var(--color-cool)', fontWeight: 600, fontSize: '0.65rem' }}>
              ↓ {coolingAchieved}°C cooling effect
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
              Baseline: {stats.baseTemp.toFixed(1)}°C
            </span>
          )}
        </div>

        {/* Vulnerability Score */}
        <div className="stat-box vuln">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldAlert size={12} />
            Heat Vulnerability
          </span>
          <h3>{stats.vulnerability.toFixed(0)}/100</h3>
          <span style={{ color: stats.vulnerability > 70 ? 'var(--color-heat)' : stats.vulnerability > 45 ? 'var(--color-warm)' : 'var(--color-cool)', fontSize: '0.65rem', fontWeight: 500 }}>
            {stats.vulnerability > 70 ? 'Critical Vulnerability' : stats.vulnerability > 45 ? 'Moderate Exposure' : 'Low Vulnerability'}
          </span>
        </div>

        {/* Canopy Cover */}
        <div className="stat-box cool">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Trees size={12} />
            Tree Canopy Cover
          </span>
          <h3>{stats.canopy.toFixed(1)}%</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
            Baseline: {stats.baseCanopy}%
          </span>
        </div>

        {/* Roof Albedo / Reflectivity */}
        <div className="stat-box blue">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Building size={12} />
            Albedo Reflectivity
          </span>
          <h3>{(stats.albedo * 100).toFixed(0)}%</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
            Baseline: {(stats.baseAlbedo * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Simulated Mitigation Card */}
      <div className="panel-card">
        <div className="card-title">
          <Activity size={15} />
          Climate Resilience Impact
        </div>
        
        <div className="compare-container">
          <div className="compare-box before">
            <span>Baseline LST</span>
            <h4>{stats.baseTemp.toFixed(1)}°C</h4>
          </div>
          <div className="compare-box after" style={{ borderColor: coolingAchieved > 0 ? 'var(--color-cool)' : 'var(--border-light)' }}>
            <span>Simulated LST</span>
            <h4>{stats.currentTemp.toFixed(1)}°C</h4>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Zap size={11} className="header-mission-icon" /> Peak Energy Savings:</span>
            <span style={{ color: 'var(--color-cool)', fontWeight: 600 }}>
              {isWardSelected ? selectedWard.energySavings.toFixed(1) : cityStats.energySavings.toFixed(1)}%
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Droplet size={11} style={{ color: 'var(--color-blue)' }} /> Thermal Comfort Lift:</span>
            <span style={{ color: 'var(--color-blue)', fontWeight: 600 }}>
              +{isWardSelected ? selectedWard.comfortLift.toFixed(1) : cityStats.comfortLift.toFixed(1)}% PMV
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Gauge size={11} style={{ color: 'var(--color-vulnerable)' }} /> Carbon Offset (Annual):</span>
            <span style={{ color: 'var(--color-vulnerable)', fontWeight: 600 }}>
              {isWardSelected ? (selectedWard.carbonOffset * (selectedWard.canopy - selectedWard.baseCanopy)).toFixed(0) : "1,420"} tons CO₂
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
