import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';

// Helper component to center/fly map when selected ward changes
function MapController({ selectedWard, wards }) {
  const map = useMap();

  useEffect(() => {
    if (selectedWard) {
      const ward = wards.find(w => w.id === selectedWard);
      if (ward && ward.center) {
        map.flyTo(ward.center, 12.5, {
          duration: 1.2,
          easeLinearity: 0.25
        });
      }
    }
  }, [selectedWard, wards, map]);

  return null;
}

export default function HeatMap({ 
  wards, 
  selectedWardId, 
  onSelectWard, 
  activeLayer 
}) {
  const delhiCenter = [28.59, 77.16]; // Delhi, India Center
  
  // Set geographical bounds to India only to restrict map movement
  const indiaBounds = [
    [6.0, 68.0],  // Southwest coordinate (bottom-left)
    [37.5, 97.5]  // Northeast coordinate (top-right)
  ];

  // Get color for a ward based on current metrics and active map layer
  const getWardStyle = (ward) => {
    const isSelected = ward.id === selectedWardId;
    let fillColor = '#ef4444';
    let fillOpacity = 0.55;

    if (activeLayer === 'temperature') {
      const temp = ward.currentTemp;
      if (temp >= 42) fillColor = 'var(--color-heat)';          // Very Hot (Dark Red)
      else if (temp >= 39) fillColor = 'var(--color-warm)';      // Hot (Orange)
      else if (temp >= 36) fillColor = 'hsl(42, 100%, 62%)';      // Warm (Yellow)
      else fillColor = 'var(--color-cool)';                     // Cooler (Green)
      
      fillOpacity = 0.35 + ((temp - 32) / 15) * 0.45;
    } else if (activeLayer === 'vulnerability') {
      const vuln = ward.vulnerability;
      if (vuln >= 80) fillColor = 'var(--color-vulnerable)';    // High Vulnerability (Deep Indigo Blue)
      else if (vuln >= 50) fillColor = 'var(--color-blue)';      // Medium
      else fillColor = 'var(--color-cool)';                     // Low
      
      fillOpacity = 0.3 + (vuln / 100) * 0.45;
    } else if (activeLayer === 'priority') {
      const priority = ward.priority;
      if (priority === 'High') fillColor = 'var(--color-heat)';
      else if (priority === 'Medium') fillColor = 'var(--color-warm)';
      else fillColor = 'var(--color-cool)';
      
      fillOpacity = 0.55;
    }

    return {
      fillColor,
      fillOpacity: isSelected ? fillOpacity + 0.15 : fillOpacity,
      color: isSelected ? 'white' : 'hsla(220, 20%, 95%, 0.15)',
      weight: isSelected ? 2.5 : 1,
      dashArray: isSelected ? '' : '3',
      className: `ward-polygon-${ward.id} transition-all duration-300`
    };
  };

  // Render Legend content dynamically
  const renderLegend = () => {
    if (activeLayer === 'temperature') {
      return (
        <>
          <div className="legend-title">Surface Temperature (°C)</div>
          <div 
            className="legend-gradient" 
            style={{ background: 'linear-gradient(to right, var(--color-cool), hsl(42, 100%, 62%), var(--color-warm), var(--color-heat))' }}
          />
          <div className="legend-labels">
            <span>&lt; 36°C</span>
            <span>39°C</span>
            <span>42°C+</span>
          </div>
        </>
      );
    } else if (activeLayer === 'vulnerability') {
      return (
        <>
          <div className="legend-title">Social Vulnerability Index</div>
          <div 
            className="legend-gradient" 
            style={{ background: 'linear-gradient(to right, hsl(260, 45%, 75%), hsl(270, 65%, 60%), hsl(280, 85%, 50%))' }}
          />
          <div className="legend-labels">
            <span>Low</span>
            <span>Medium</span>
            <span>High Risk</span>
          </div>
        </>
      );
    } else if (activeLayer === 'priority') {
      return (
        <>
          <div className="legend-title">Intervention Priority</div>
          <div className="legend-labels" style={{ marginTop: '0.25rem', gap: '0.4rem', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-heat)' }}></span>
              <span>High Priority (Hot & Dense)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warm)' }}></span>
              <span>Medium Priority</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-cool)' }}></span>
              <span>Low Priority (Stable Zones)</span>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="map-container-wrapper">
      <MapContainer 
        center={delhiCenter} 
        zoom={11} 
        zoomControl={true}
        maxZoom={15}
        minZoom={5}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {wards.map((ward) => (
          <Polygon
            key={ward.id}
            positions={ward.coordinates}
            eventHandlers={{
              click: () => onSelectWard(ward.id),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: getWardStyle(ward).fillOpacity + 0.1,
                  weight: 2
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(getWardStyle(ward));
              }
            }}
            pathOptions={getWardStyle(ward)}
          />
        ))}

        <MapController selectedWard={selectedWardId} wards={wards} />
      </MapContainer>

      {/* Map Overlay Legend */}
      <div className="map-legend">
        {renderLegend()}
      </div>
    </div>
  );
}