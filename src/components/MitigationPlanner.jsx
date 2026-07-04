import React from 'react';
import { Trees, Paintbrush, Droplet, Sparkles, RotateCcw } from 'lucide-react';

export default function MitigationPlanner({ 
  selectedWard, 
  onUpdateInterventions, 
  onResetInterventions,
  onAutoOptimize
}) {
  if (!selectedWard) {
    return (
      <div className="panel-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Click on a ward on the map or select from the sidebar to plan cooling interventions.
        </p>
      </div>
    );
  }

  // Get current intervention deltas for selected ward
  const treeDelta = selectedWard.treeDelta || 0;
  const roofDelta = selectedWard.roofDelta || 0;
  const waterDelta = selectedWard.waterDelta || 0;

  // Handles slider changes
  const handleSliderChange = (type, val) => {
    const value = parseFloat(val);
    const updates = {
      treeDelta: type === 'tree' ? value : treeDelta,
      roofDelta: type === 'roof' ? value : roofDelta,
      waterDelta: type === 'water' ? value : waterDelta,
    };
    onUpdateInterventions(selectedWard.id, updates);
  };

  return (
    <div className="panel-card">
      <div className="card-title">
        <Sparkles size={15} />
        Mitigation Planner: {selectedWard.name}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Move the sliders to explore simple cooling actions like trees, reflective roofs, and water-friendly streets.
      </p>

      <div className="slider-group">
        {/* Intervention 1: Tree Canopy Planting */}
        <div className="sim-slider-container">
          <div className="slider-header">
            <span className="slider-label">
              <Trees size={14} style={{ color: 'var(--color-cool)' }} />
              Add Tree Canopy
            </span>
            <span className="slider-value positive">+{treeDelta}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="30" 
            step="1"
            value={treeDelta}
            onChange={(e) => handleSliderChange('tree', e.target.value)}
            className="sim-slider canopy"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
            <span>Current Canopy: {selectedWard.canopy.toFixed(1)}%</span>
            <span>Target max: +30%</span>
          </div>
        </div>

        {/* Intervention 2: Cool Roof Application */}
        <div className="sim-slider-container">
          <div className="slider-header">
            <span className="slider-label">
              <Paintbrush size={14} style={{ color: 'var(--color-warm)' }} />
              Cool Roofs (Albedo)
            </span>
            <span className="slider-value positive">+{roofDelta}% area</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            value={roofDelta}
            onChange={(e) => handleSliderChange('roof', e.target.value)}
            className="sim-slider roof"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
            <span>Reflectivity: {((selectedWard.albedo) * 100).toFixed(0)}%</span>
            <span>Max scale: 100%</span>
          </div>
        </div>

        {/* Intervention 3: Reflective Pavements & Water Bodies */}
        <div className="sim-slider-container">
          <div className="slider-header">
            <span className="slider-label">
              <Droplet size={14} style={{ color: 'var(--color-blue)' }} />
              Urban Water & Greenways
            </span>
            <span className="slider-value positive">+{waterDelta}% area</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="50" 
            step="2"
            value={waterDelta}
            onChange={(e) => handleSliderChange('water', e.target.value)}
            className="sim-slider water"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
            <span>Mitigation buffer: {selectedWard.waterDelta || 0}%</span>
            <span>Max scale: 50%</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
        <button 
          className="action-btn"
          onClick={() => onAutoOptimize(selectedWard.id)}
          style={{ flex: 2 }}
        >
          <Sparkles size={13} />
          Optimize Plan
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => onResetInterventions(selectedWard.id)}
          style={{ flex: 1 }}
          title="Reset sliders"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* Recommendation Summary */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.65rem', 
        borderRadius: '6px', 
        background: 'hsla(150, 85%, 44%, 0.04)', 
        border: '1px solid hsla(150, 85%, 44%, 0.15)',
        fontSize: '0.7rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-cool)', fontWeight: 600, marginBottom: '0.2rem' }}>
          <Sparkles size={11} />
          Recommended Strategy:
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
          {selectedWard.recommendationSummary || 'Balanced strategy for neighborhood cooling.'}
        </p>
        <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {(selectedWard.recommendedActions || []).map(action => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
