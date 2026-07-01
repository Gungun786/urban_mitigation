import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
  CircleMarker,
  Marker,
  Popup
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

import Papa from 'papaparse';
import { BIKANER_HEAT_POINTS } from '../data/bikanerHeatmapPoints';

function HeatLayer() {
  const map = useMap();
  const heatLayer = useRef(null);

  useEffect(() => {
    Papa.parse('/heatmap_data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const heatPoints = results.data
          .filter(
            (row) =>
              row.Latitude &&
              row.Longitude &&
              row.LST_Day_1km
          )
          .map((row) => [
            parseFloat(row.Latitude),
            parseFloat(row.Longitude),
            parseFloat(row.LST_Day_1km) / 50,
          ]);

        if (heatLayer.current) {
          map.removeLayer(heatLayer.current);
        }

        heatLayer.current = L.heatLayer(heatPoints, {
          radius: 12,
          blur: 15,
          max: 0.5,
          maxZoom: 18,
          minOpacity: 1.0,
          gradient: {
            0.0: 'blue',
            0.25: 'cyan',
            0.5: 'yellow',
            0.75: 'orange',
            1.0: 'red',
          },
        });

        heatLayer.current.addTo(map);
      },
    });

    return () => {
      if (heatLayer.current) {
        map.removeLayer(heatLayer.current);
      }
    };
  }, [map]);

  return null;
}

// Helper component to center/fly map when selected ward changes
function MapController({ selectedWard, wards }) {
  const map = useMap();

  useEffect(() => {
    if (selectedWard) {
      const ward = wards.find((w) => w.id === selectedWard);
      if (ward && ward.center) {
        map.flyTo(ward.center, 12.5, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      }
    }
  }, [selectedWard, wards, map]);

  return null;
}

export default function HeatMap({
  wards = [],
  selectedWardId,
  onSelectWard = () => {},
  activeLayer = 'temperature',
}) {
  const delhiCenter = [28.59, 77.16];

  const indiaBounds = [
    [6.0, 68.0],
    [37.5, 97.5],
  ];

  const getWardStyle = (ward) => {
    const isSelected = ward.id === selectedWardId;
    let fillColor = '#ef4444';
    let fillOpacity = 0.55;

    if (activeLayer === 'temperature') {
      const temp = ward.currentTemp;
      if (temp >= 42) fillColor = 'var(--color-heat)';
      else if (temp >= 39) fillColor = 'var(--color-warm)';
      else if (temp >= 36) fillColor = 'hsl(42, 100%, 62%)';
      else fillColor = 'var(--color-cool)';

      fillOpacity = 0.35 + ((temp - 32) / 15) * 0.45;
    } else if (activeLayer === 'vulnerability') {
      const vuln = ward.vulnerability;
      if (vuln >= 80) fillColor = 'var(--color-vulnerable)';
      else if (vuln >= 50) fillColor = 'var(--color-blue)';
      else fillColor = 'var(--color-cool)';

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
      className: `ward-polygon-${ward.id} transition-all duration-300`,
    };
  };

  const renderLegend = () => {
    if (activeLayer === 'temperature') {
      return (
        <>
          <div className="legend-title">Surface Temperature (°C)</div>
          <div
            className="legend-gradient"
            style={{
              background:
                'linear-gradient(to right, var(--color-cool), hsl(42, 100%, 62%), var(--color-warm), var(--color-heat))',
            }}
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
            style={{
              background:
                'linear-gradient(to right, hsl(260, 45%, 75%), hsl(270, 65%, 60%), hsl(280, 85%, 50%))',
            }}
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
          <div
            className="legend-labels"
            style={{
              marginTop: '0.25rem',
              gap: '0.4rem',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-heat)',
                }}
              ></span>
              <span>High Priority (Hot & Dense)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-warm)',
                }}
              ></span>
              <span>Medium Priority</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-cool)',
                }}
              ></span>
              <span>Low Priority (Stable Zones)</span>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      className="map-container-wrapper"
      style={{
        minHeight: '300px',
        height: '300px',
        width: '100%',
        position: 'relative',
      }}
    >
      <MapContainer
        center={delhiCenter}
        zoom={11}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
        maxZoom={15}
        minZoom={5}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* CSV heatmap layer */}
        <HeatLayer />

        {/* Static city markers */}
        <Marker position={[28.61, 77.2]}>
          <Popup>
            <b>Delhi</b>
            <br />
            Avg Temp: 42.5°C
            <br />
            Severity: High
          </Popup>
        </Marker>

        <Marker position={[25.21, 75.86]}>
          <Popup>
            <b>Kota</b>
            <br />
            Avg Temp: 40.8°C
            <br />
            Severity: Moderate
          </Popup>
        </Marker>

        <Marker position={[26.24, 73.02]}>
          <Popup>
            <b>Jodhpur</b>
            <br />
            Avg Temp: 41.4°C
            <br />
            Severity: High
          </Popup>
        </Marker>

        <Marker position={[28.02, 73.31]}>
          <Popup>
            <b>Bikaner</b>
            <br />
            Avg Temp: 39.9°C
            <br />
            Severity: Moderate
          </Popup>
        </Marker>

        {/* Ward polygons */}
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
                  weight: 2,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(getWardStyle(ward));
              },
            }}
            pathOptions={getWardStyle(ward)}
          />
        ))}

        {/* Bikaner heat points */}
        {Array.isArray(BIKANER_HEAT_POINTS) &&
          BIKANER_HEAT_POINTS.length > 0 &&
          BIKANER_HEAT_POINTS.map((pt, idx) => (
            <CircleMarker
              key={`bpt-${idx}`}
              center={[pt.lat, pt.lng]}
              radius={4}
              pathOptions={{
                color:
                  pt.temp >= 45
                    ? 'var(--color-heat)'
                    : pt.temp >= 39
                    ? 'var(--color-warm)'
                    : 'var(--color-cool)',
                fillOpacity: 0.9,
              }}
            />
          ))}

        <MapController selectedWard={selectedWardId} wards={wards} />
      </MapContainer>

      {/* Dynamic legend from ward-layer file */}
      <div className="map-legend">{renderLegend()}</div>

      {/* Static heat-intensity legend from CSV heatmap file */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'white',
          padding: '12px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '13px',
        }}
      >
        <b>Heat Intensity</b>

        <div style={{ color: 'blue', marginTop: '5px' }}>
          ● Cool (&lt;36°C)
        </div>

        <div style={{ color: 'green' }}>
          ● Moderate (36–39°C)
        </div>

        <div style={{ color: 'orange' }}>
          ● Hot (39–42°C)
        </div>

        <div style={{ color: 'red' }}>
          ● Extreme (&gt;42°C)
        </div>
      </div>
    </div>
  );
}