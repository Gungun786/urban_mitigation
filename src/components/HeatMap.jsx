
import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap,Marker,Popup } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import Papa from "papaparse";

function HeatLayer() {
  const map = useMap();
  const heatLayer = useRef(null);

  useEffect(() => {
    Papa.parse("/heatmap_data.csv", {
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

            // normalize temperature
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
            0.0: "blue",
            0.25: "cyan",
            0.50: "yellow",
            0.75: "orange",
            1.0: "red",
          },
        });

        heatLayer.current.addTo(map);
      },
    });
  }, [map]);

  return null;
}

export default function HeatMap() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <MapContainer
        center={[27.5, 77]}
        zoom={6}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <Marker position={[28.61,77.20]}>
        <Popup>
        <b>Delhi</b><br/>
        Avg Temp: 42.5°C<br/>
        Severity: High
        </Popup>
        </Marker>

        <Marker position={[25.21,75.86]}>
        <Popup>
        <b>Kota</b><br/>
        Avg Temp: 40.8°C<br/>
        Severity: Moderate
        </Popup>
        </Marker>

        <Marker position={[26.24,73.02]}>
        <Popup>
        <b>Jodhpur</b><br/>
        Avg Temp: 41.4°C<br/>
        Severity: High
        </Popup>
        </Marker>

        <Marker position={[28.02,73.31]}>
        <Popup>
        <b>Bikaner</b><br/>
        Avg Temp: 39.9°C<br/>
        Severity: Moderate
        </Popup>
        </Marker>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer />
      </MapContainer>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          background: "white",
          padding: "12px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          fontSize: "13px",
        }}
      >
        <b>Heat Intensity</b>

        <div style={{ color: "blue", marginTop: "5px" }}>
          ● Cool (&lt;36°C)
        </div>

        <div style={{ color: "green" }}>
          ● Moderate (36–39°C)
        </div>

        <div style={{ color: "orange" }}>
          ● Hot (39–42°C)
        </div>

        <div style={{ color: "red" }}>
          ● Extreme (&gt;42°C)
        </div>
      </div>
    </div>
  );
}