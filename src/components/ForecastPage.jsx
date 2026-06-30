import React from 'react';
import { Thermometer, CalendarDays, MapPin } from 'lucide-react';
import PredictionChart from './PredictionChart';
import HeatMap from './HeatMap';

export default function ForecastPage({
  wards,
  selectedWardId,
  selectedWard,
  onSelectWard,
  activeLayer,
}) {
  const ward = selectedWard || wards[0];

  return (
    <main className="forecast-grid">
      <section className="dashboard-panel">
        <div className="panel-card">
          <div className="card-title">
            <Thermometer size={16} />
            Temperature Forecast
          </div>
          <p className="panel-copy">
            Forecasted temperature trends for the selected neighborhood help you plan cooling actions ahead of the next heat wave.
          </p>
          <PredictionChart selectedWard={ward} cityStats={ward} />
        </div>

        <div className="panel-card">
          <div className="card-title">
            <CalendarDays size={16} />
            Forecast Highlights
          </div>
          <div className="forecast-summary">
            <div>
              <span>Peak Heat Window</span>
              <strong>12:00 PM – 4:00 PM</strong>
            </div>
            <div>
              <span>Projected Peak</span>
              <strong>{ward.currentTemp.toFixed(1)}°C</strong>
            </div>
            <div>
              <span>Expected Cooling</span>
              <strong>{(ward.baseTemp - ward.currentTemp).toFixed(1)}°C</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-panel right">
        <div className="panel-card small-map-card">
          <div className="card-title">
            <MapPin size={16} />
            Current Map View
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
            <Thermometer size={16} />
            Planning Notes
          </div>
          <p className="panel-copy">
            Use this forecast to prioritize shade, cool roof, and water-smart infrastructure in the most vulnerable neighborhoods.
          </p>
        </div>
      </section>
    </main>
  );
}
