import React from 'react';
import { Database, Cloud, Map, Cpu } from 'lucide-react';

export default function DataSources() {
  const tickerItems = [
    "Satellite imagery confirms market heat spikes—shade and cool roofs can help.",
    "Vegetation index updated for West Delhi, with neighborhood tree cover opportunities identified.",
    "Weather station reports 42.1°C and dry breeze; residents urged to stay hydrated.",
    "Local street sensors show downtown surface heating over 45°C during midday peaks.",
    "Urban canopy survey highlights key corridors where shade planting can improve comfort.",
    "GIS heat index maps refreshed with new community-driven green projects.",
    "Forecast model flags 4 priority wards for immediate cooling interventions."
  ];

  // Double the array to make the infinite scroll loop seamless
  const scrollItems = [...tickerItems, ...tickerItems];

  return (
    <footer className="app-footer">
      {/* Live Scrolling Ticker */}
      <div className="footer-ticker">
        <div className="ticker-wrapper">
          {scrollItems.map((item, idx) => (
            <div key={idx} className="ticker-item">
              <span className="ticker-item-dot ping"></span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connection status indicators */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="source-tag" title="ISRO Landsat / Sentinel">
          <Database size={10} style={{ color: 'var(--color-cool)' }} />
          Satellite Feed
        </div>
        <div className="source-tag" title="IMD / Weather API">
          <Cloud size={10} style={{ color: 'var(--color-blue)' }} />
          Weather Feed
        </div>
        <div className="source-tag" title="Municipal Urban GIS Data">
          <Map size={10} style={{ color: 'var(--color-warm)' }} />
          GIS Layers
        </div>
        <div className="source-tag" title="Local IoT Station Cluster">
          <Cpu size={10} style={{ color: 'var(--color-vulnerable)' }} />
          IoT Sensors
        </div>
        <div className="footer-status">
          <span style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            background: 'var(--color-cool)',
            boxShadow: '0 0 6px var(--color-cool)',
            display: 'inline-block'
          }}></span>
          <span>LIVE</span>
        </div>
      </div>
    </footer>
  );
}
