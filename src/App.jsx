import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Trees, 
  Sparkles, 
  RefreshCw, 
  TrendingDown, 
  Layers,
  MapPin,
  Compass,
  AlertTriangle
} from 'lucide-react';

import HeatMap from './components/HeatMap';
import StatsPanel from './components/StatsPanel';
import MitigationPlanner from './components/MitigationPlanner';
import PredictionChart from './components/PredictionChart';
import ForecastPage from './components/ForecastPage';
import AIScoringPage from './components/AIScoringPage';
import DataSources from './components/DataSources';

// Mock dataset representing 5 distinct wards in New Delhi, India with realistic geospatial parameters
const INITIAL_WARDS = [
  {
    id: 'ward-connaught',
    name: 'Connaught Place / Central (Ward A)',
    center: [28.63, 77.2175],
    coordinates: [
      [28.645, 77.20],
      [28.645, 77.235],
      [28.615, 77.235],
      [28.615, 77.20]
    ],
    baseTemp: 43.8,
    currentTemp: 43.8,
    baseCanopy: 12.0,
    canopy: 12.0,
    baseAlbedo: 0.14,
    albedo: 0.14,
    baseVulnerability: 78,
    vulnerability: 78,
    priority: 'High',
    description: 'Commercial and administrative center. Dominated by concrete plazas, high vehicular traffic, and localized asphalt corridors.',
    treeDelta: 0,
    roofDelta: 0,
    waterDelta: 0,
    energySavings: 0,
    comfortLift: 0,
    carbonOffset: 14.2
  },
  {
    id: 'ward-okhla',
    name: 'Okhla Industrial Area (Ward B)',
    center: [28.535, 77.2825],
    coordinates: [
      [28.555, 77.26],
      [28.555, 77.305],
      [28.515, 77.305],
      [28.515, 77.26]
    ],
    baseTemp: 46.5,
    currentTemp: 46.5,
    baseCanopy: 3.5,
    canopy: 3.5,
    baseAlbedo: 0.11,
    albedo: 0.11,
    baseVulnerability: 85,
    vulnerability: 85,
    priority: 'High',
    description: 'Manufacturing cluster with extensive metal warehouse roofs, packaging facilities, low vegetation density, and high ambient heat emission.',
    treeDelta: 0,
    roofDelta: 0,
    waterDelta: 0,
    energySavings: 0,
    comfortLift: 0,
    carbonOffset: 10.5
  },
  {
    id: 'ward-dwarka',
    name: 'Dwarka Sector 10 (Ward C)',
    center: [28.5925, 77.045],
    coordinates: [
      [28.615, 77.02],
      [28.615, 77.07],
      [28.57, 77.07],
      [28.57, 77.02]
    ],
    baseTemp: 40.2,
    currentTemp: 40.2,
    baseCanopy: 16.5,
    canopy: 16.5,
    baseAlbedo: 0.18,
    albedo: 0.18,
    baseVulnerability: 50,
    vulnerability: 50,
    priority: 'Medium',
    description: 'High-density multi-story residential housing societies. Moderate grid-road tree cover with developing parkway corridors.',
    treeDelta: 0,
    roofDelta: 0,
    waterDelta: 0,
    energySavings: 0,
    comfortLift: 0,
    carbonOffset: 16.0
  },
  {
    id: 'ward-karolbagh',
    name: 'Karol Bagh Market (Ward D)',
    center: [28.6475, 77.185],
    coordinates: [
      [28.665, 77.17],
      [28.665, 77.20],
      [28.63, 77.20],
      [28.63, 77.17]
    ],
    baseTemp: 44.1,
    currentTemp: 44.1,
    baseCanopy: 5.8,
    canopy: 5.8,
    baseAlbedo: 0.13,
    albedo: 0.13,
    baseVulnerability: 82,
    vulnerability: 82,
    priority: 'High',
    description: 'Densely packed commercial marketplace. Narrow lanes, high concrete building ratio, high human congestion, and severe canopy deficit.',
    treeDelta: 0,
    roofDelta: 0,
    waterDelta: 0,
    energySavings: 0,
    comfortLift: 0,
    carbonOffset: 12.8
  },
  {
    id: 'ward-sanjayvan',
    name: 'Sanjay Van Reserve (Ward E)',
    center: [28.5275, 77.165],
    coordinates: [
      [28.545, 77.14],
      [28.545, 77.19],
      [28.51, 77.19],
      [28.51, 77.14]
    ],
    baseTemp: 35.8,
    currentTemp: 35.8,
    baseCanopy: 32.5,
    canopy: 32.5,
    baseAlbedo: 0.22,
    albedo: 0.22,
    baseVulnerability: 26,
    vulnerability: 26,
    priority: 'Low',
    description: 'Forest reserve and natural scrub land in South Delhi. Acts as a green lung, providing micro-climate cooling to surrounding neighborhoods.',
    treeDelta: 0,
    roofDelta: 0,
    waterDelta: 0,
    energySavings: 0,
    comfortLift: 0,
    carbonOffset: 19.5
  }
];

export default function App() {
  const [wards, setWards] = useState(INITIAL_WARDS);
  const [selectedWardId, setSelectedWardId] = useState(INITIAL_WARDS[0].id);
  const [activeLayer, setActiveLayer] = useState('temperature'); // temperature, vulnerability, priority
  const [activePage, setActivePage] = useState('dashboard'); // dashboard, forecast, ai

  // Find the currently selected ward object
  const selectedWard = useMemo(() => {
    return wards.find(w => w.id === selectedWardId) || null;
  }, [wards, selectedWardId]);

  // Calculate city-wide statistics (averages/totals) dynamically
  const cityStats = useMemo(() => {
    const totalWards = wards.length;
    
    const sumBaseTemp = wards.reduce((acc, curr) => acc + curr.baseTemp, 0);
    const sumCurrentTemp = wards.reduce((acc, curr) => acc + curr.currentTemp, 0);
    const sumBaseCanopy = wards.reduce((acc, curr) => acc + curr.baseCanopy, 0);
    const sumCanopy = wards.reduce((acc, curr) => acc + curr.canopy, 0);
    const sumBaseAlbedo = wards.reduce((acc, curr) => acc + curr.baseAlbedo, 0);
    const sumAlbedo = wards.reduce((acc, curr) => acc + curr.albedo, 0);
    const sumVulnerability = wards.reduce((acc, curr) => acc + curr.vulnerability, 0);
    
    const sumEnergy = wards.reduce((acc, curr) => acc + curr.energySavings, 0);
    const sumComfort = wards.reduce((acc, curr) => acc + curr.comfortLift, 0);
    
    // Total carbon offsets = canopy delta * carbon coefficient per ward
    const totalCarbon = wards.reduce((acc, curr) => {
      const deltaCanopy = curr.canopy - curr.baseCanopy;
      return acc + (deltaCanopy * curr.carbonOffset);
    }, 0);

    return {
      baseTemp: sumBaseTemp / totalWards,
      currentTemp: sumCurrentTemp / totalWards,
      baseCanopy: sumBaseCanopy / totalWards,
      canopy: sumCanopy / totalWards,
      baseAlbedo: sumBaseAlbedo / totalWards,
      albedo: sumAlbedo / totalWards,
      vulnerability: sumVulnerability / totalWards,
      energySavings: sumEnergy / totalWards,
      comfortLift: sumComfort / totalWards,
      totalCarbon
    };
  }, [wards]);

  // Recalculates metrics for a single ward based on delta parameters
  const recalculateWardMetrics = (ward, treeD, roofD, waterD) => {
    // Math model: 
    // - Tree canopy planting (-0.16°C per 1% canopy added)
    // - Cool roof installation (-0.04°C per 1% roof area converted)
    // - Reflective pavement / water greenways (-0.08°C per 1% area converted)
    const tempReduction = (treeD * 0.16) + (roofD * 0.045) + (waterD * 0.09);
    const currentTemp = Math.max(30.0, ward.baseTemp - tempReduction);
    
    // Canopy grows linearly with tree planting delta
    const canopy = ward.baseCanopy + treeD;
    
    // Albedo scales with roof painting (from base up to a max albedo value e.g. 0.6)
    const albedo = ward.baseAlbedo + (roofD / 100) * 0.42;
    
    // Vulnerability index drops as temperatures cool down (lowers heat stroke risks)
    const vulnDrop = tempReduction * 2.8;
    const vulnerability = Math.max(10, ward.baseVulnerability - vulnDrop);
    
    // Energy savings and thermal comfort indices scale up
    const energySavings = (treeD * 0.4) + (roofD * 0.2) + (waterD * 0.15);
    const comfortLift = (treeD * 0.5) + (roofD * 0.25) + (waterD * 0.35);

    return {
      ...ward,
      treeDelta: treeD,
      roofDelta: roofD,
      waterDelta: waterD,
      currentTemp,
      canopy,
      albedo,
      vulnerability,
      energySavings,
      comfortLift
    };
  };

  // Slider change handler
  const handleUpdateInterventions = (wardId, deltas) => {
    setWards(prevWards => prevWards.map(w => {
      if (w.id === wardId) {
        return recalculateWardMetrics(w, deltas.treeDelta, deltas.roofDelta, deltas.waterDelta);
      }
      return w;
    }));
  };

  // Resets a single ward's interventions
  const handleResetInterventions = (wardId) => {
    setWards(prevWards => prevWards.map(w => {
      if (w.id === wardId) {
        return recalculateWardMetrics(w, 0, 0, 0);
      }
      return w;
    }));
  };

  // Auto-optimizes a selected ward based on its vulnerability and baseline parameters
  const handleAutoOptimize = (wardId) => {
    setWards(prevWards => prevWards.map(w => {
      if (w.id === wardId) {
        // High priority wards get high interventions; lower priority gets moderate, balanced for ROI
        if (w.priority === 'High') {
          return recalculateWardMetrics(w, 20, 75, 25); // Heavy cool roofs and trees
        } else if (w.priority === 'Medium') {
          return recalculateWardMetrics(w, 15, 50, 15);
        } else {
          return recalculateWardMetrics(w, 8, 30, 10);
        }
      }
      return w;
    }));
  };

  // Resets all interventions across the city
  const handleResetAll = () => {
    setWards(prevWards => prevWards.map(w => recalculateWardMetrics(w, 0, 0, 0)));
  };

  return (
    <div className="app-container">
      
      {/* App Header */}
      <header className="app-header">
        <div className="header-brand">
          <Flame size={26} className="header-logo" />
          <div>
            <h1>HeatShield</h1>
            <p className="header-tagline">Community-first cooling insights for healthier neighborhoods.</p>
          </div>
          <span>v1.0.0</span>
        </div>
        <div className="header-mission">
          <Compass size={18} className="header-mission-icon" />
          <p>Design urban heat solutions rooted in local context, green infrastructure, and people-centered resilience.</p>
        </div>
      </header>

      <nav className="page-tabs">
        <button
          className={`page-tab ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
        >
          Overview
        </button>
        <button
          className={`page-tab ${activePage === 'forecast' ? 'active' : ''}`}
          onClick={() => setActivePage('forecast')}
        >
          Heat Forecast
        </button>
        <button
          className={`page-tab ${activePage === 'ai' ? 'active' : ''}`}
          onClick={() => setActivePage('ai')}
        >
          AI Heat Score
        </button>
      </nav>

      {activePage === 'dashboard' ? (
        <main className="dashboard-grid">
        
        {/* Left Panel: City-Wide Overview & Ward Ranker */}
        <section className="dashboard-panel">
          
          {/* Mission Card */}
          <div className="panel-card" style={{ borderLeft: '3px solid var(--color-cool)' }}>
            <div className="card-title">
              <Compass size={15} style={{ color: 'var(--color-cool)' }} />
              About
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              A collaborative dashboard for communities and planners to explore cooling strategies. Adjust neighborhood interventions, then see the projected impact on heat, comfort and resilience.
            </p>
          </div>

          {/* City Summary Stats */}
          <div className="panel-card">
            <div className="card-title" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingDown size={15} />
                City-wide Cooling Lift
              </span>
              {(cityStats.baseTemp - cityStats.currentTemp) > 0 && (
                <button 
                  onClick={handleResetAll}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.65rem'
                  }}
                  title="Reset all wards"
                >
                  <RefreshCw size={10} /> Reset
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AVG LAND SURFACE TEMP</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.1rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {cityStats.currentTemp.toFixed(1)}°C
                  </h3>
                  {(cityStats.baseTemp - cityStats.currentTemp) > 0 && (
                    <span style={{ color: 'var(--color-cool)', fontSize: '0.75rem', fontWeight: 600 }}>
                      ↓ {(cityStats.baseTemp - cityStats.currentTemp).toFixed(1)}°C
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                <div style={{ background: 'hsla(220, 20%, 95%, 0.01)', border: '1px solid var(--border-light)', padding: '0.4rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>AVG CANOPY</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-cool)' }}>
                    {cityStats.canopy.toFixed(1)}%
                  </p>
                </div>
                <div style={{ background: 'hsla(220, 20%, 95%, 0.01)', border: '1px solid var(--border-light)', padding: '0.4rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>CO₂ SEQUESTRATION</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-vulnerable)' }}>
                    {cityStats.totalCarbon.toFixed(0)} t/y
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ward Heat Rankings */}
          <div className="panel-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">
              <Flame size={15} style={{ color: 'var(--color-heat)' }} />
              Wards & Risk Profile
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Pick a neighborhood to design local cooling actions and compare their effects in real time.
            </p>

            <div className="ward-list">
              {wards.map((ward) => {
                const isSelected = ward.id === selectedWardId;
                const tempDiff = ward.baseTemp - ward.currentTemp;
                
                return (
                  <div 
                    key={ward.id}
                    className={`ward-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedWardId(ward.id)}
                  >
                    <div className="ward-name-container">
                      <span className="ward-bullet" style={{ 
                        background: ward.priority === 'High' ? 'var(--color-heat)' : ward.priority === 'Medium' ? 'var(--color-warm)' : 'var(--color-cool)' 
                      }}></span>
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{ward.name.split(' (')[0]}</span>
                    </div>

                    <div className="ward-metrics">
                      <span className="ward-temp">{ward.currentTemp.toFixed(1)}°C</span>
                      {tempDiff > 0 && (
                        <span style={{ color: 'var(--color-cool)', fontSize: '0.65rem', fontWeight: 600 }}>
                          ↓{tempDiff.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanatory Alert */}
            <div style={{ 
              marginTop: 'auto', 
              padding: '0.5rem', 
              borderRadius: '4px', 
              background: 'hsla(205, 100%, 55%, 0.08)', 
              border: '1px solid hsla(205, 100%, 55%, 0.18)', 
              display: 'flex', 
              gap: '0.4rem',
              alignItems: 'flex-start',
              fontSize: '0.65rem' 
            }}>
              <AlertTriangle size={14} style={{ color: 'var(--color-heat)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                Alert: 3 of 5 wards report low canopy cover (&lt; 10%). Action recommended.
              </p>
            </div>
          </div>

        </section>

        {/* Center Panel: Map Viewport & Overlay Controls */}
        <section className="map-viewport">
          
          {/* Map Layer Selector Toolbar */}
          <div className="map-layer-selector">
            <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0 0.5rem', color: 'var(--text-muted)' }}>
              <Layers size={11} /> OVERLAYS:
            </span>
            <button 
              className={`layer-btn heat ${activeLayer === 'temperature' ? 'active' : ''}`}
              onClick={() => setActiveLayer('temperature')}
            >
              Surface Temp
            </button>
            <button 
              className={`layer-btn vuln ${activeLayer === 'vulnerability' ? 'active' : ''}`}
              onClick={() => setActiveLayer('vulnerability')}
            >
              Social Vulnerability
            </button>
            <button 
              className={`layer-btn prior ${activeLayer === 'priority' ? 'active' : ''}`}
              onClick={() => setActiveLayer('priority')}
            >
              Mitigation Priority
            </button>
          </div>

          {/* Interactive Geospatial Leaflet Map */}
          <HeatMap />

        </section>

        {/* Right Panel: Detailed Metrics, Intervention Sandbox, Charts */}
        <section className="dashboard-panel right">
          
          {/* Ward KPIs Panel */}
          <StatsPanel 
            selectedWard={selectedWard} 
            cityStats={cityStats} 
          />

          {/* Dynamic Sliders Simulation Tool */}
          <MitigationPlanner 
            selectedWard={selectedWard}
            onUpdateInterventions={handleUpdateInterventions}
            onResetInterventions={handleResetInterventions}
            onAutoOptimize={handleAutoOptimize}
          />

          {/* Diurnal Forecast Line Chart */}
          <PredictionChart 
            selectedWard={selectedWard}
            cityStats={cityStats}
          />

        </section>

      </main>
      ) : activePage === 'forecast' ? (
        <ForecastPage
          wards={wards}
          selectedWardId={selectedWardId}
          selectedWard={selectedWard}
          onSelectWard={setSelectedWardId}
          activeLayer={activeLayer}
        />
      ) : (
        <AIScoringPage
          wards={wards}
          selectedWardId={selectedWardId}
          selectedWard={selectedWard}
          onSelectWard={setSelectedWardId}
          activeLayer={activeLayer}
        />
      )}

      {/* Footer bar featuring Landsat & IoT live-updating feed */}
      <DataSources />

    </div>
  );
}
