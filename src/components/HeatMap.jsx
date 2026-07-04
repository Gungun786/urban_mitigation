import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import Papa from "papaparse";

function HeatLayer({ cities }) {
  const map = useMap();
  const heatLayer = useRef(null);

  function generateCluster(lat, lon, spread, count, intensity) {
    const points = [];

    for (let i = 0; i < count; i++) {
      points.push([
        lat + (Math.random() - 0.5) * spread,
        lon + (Math.random() - 0.5) * spread,
        intensity,
      ]);
    }

    return points;
  }

  useEffect(() => {
    Papa.parse("/heatmap_data.csv", {
      download: true,
      header: true,

      complete: (results) => {
        let heatPoints = [];

        // existing satellite points
        const satellite = results.data
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

        heatPoints.push(...satellite);

        // Rajasthan
        heatPoints.push(
          ...generateCluster(26.9, 75.8, 2.2, 100, 1.0),
          ...generateCluster(26.2, 73.0, 2.0, 100, 1.0),
          ...generateCluster(28.0, 73.3, 2.0, 100, 1.0)
        );

        // Delhi NCR
        heatPoints.push(
          ...generateCluster(28.61, 77.20, 1.2, 80, 0.95)
        );

        // Gujarat
        heatPoints.push(
          ...generateCluster(23.0, 72.5, 1.8, 70, 0.75)
        );

        // Madhya Pradesh
        heatPoints.push(
          ...generateCluster(23.2, 77.4, 1.8, 70, 0.7)
        );

        // Maharashtra
        heatPoints.push(
          ...generateCluster(19.0, 72.8, 1.5, 60, 0.7)
        );

        // Uttar Pradesh
        heatPoints.push(
          ...generateCluster(26.8, 80.9, 1.5, 50, 0.5)
        );

        // Bihar
        heatPoints.push(
          ...generateCluster(25.5, 85.1, 1.2, 40, 0.45)
        );

        // South India
        heatPoints.push(
          ...generateCluster(13.0, 80.2, 1.0, 30, 0.3),
          ...generateCluster(12.9, 77.5, 1.0, 30, 0.3),
          ...generateCluster(8.5, 76.9, 1.0, 20, 0.2)
        );

        // Himalayas
        heatPoints.push(
          ...generateCluster(34.0, 74.7, 1.0, 20, 0.1),
          ...generateCluster(31.1, 77.1, 1.0, 20, 0.1)
        );

        if (heatLayer.current) {
          map.removeLayer(heatLayer.current);
        }

        heatLayer.current = L.heatLayer(
          heatPoints,
          {
            radius: 25,
            blur: 18,
            max: 1.0,
            minOpacity: 0.4,

            gradient: {
              0.1: "#0066ff",
              0.3: "#00ff88",
              0.5: "#ffff00",
              0.7: "#ff8800",
              1.0: "#ff0000",
            },
          }
        );

        heatLayer.current.addTo(map);
      },
    });
  }, [map, cities]);

  return null;
}

export default function HeatMap() {
  const [cities, setCities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const cityData = [
    { name: "Delhi", lat: 28.61, lon: 77.20 },
    { name: "Mumbai", lat: 19.07, lon: 72.87 },
    { name: "Kolkata", lat: 22.57, lon: 88.36 },
    { name: "Chennai", lat: 13.08, lon: 80.27 },
    { name: "Bengaluru", lat: 12.97, lon: 77.59 },
    { name: "Hyderabad", lat: 17.38, lon: 78.48 },
    { name: "Ahmedabad", lat: 23.02, lon: 72.57 },
    { name: "Jaipur", lat: 26.91, lon: 75.79 },
    { name: "Lucknow", lat: 26.84, lon: 80.94 },
    { name: "Patna", lat: 25.59, lon: 85.13 },
    { name: "Bhopal", lat: 23.25, lon: 77.41 },
    { name: "Srinagar", lat: 34.08, lon: 74.79 },
    { name: "Thiruvananthapuram", lat: 8.52, lon: 76.93 },
  ];

  async function fetchLiveData() {
    const updated = await Promise.all(
      cityData.map(async (city) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m`
        );

        const data = await response.json();

        const temp = data.current.temperature_2m;

        return {
          ...city,
          temp,
          severity:
            temp > 42
              ? "Extreme"
              : temp > 39
              ? "High"
              : temp > 36
              ? "Moderate"
              : "Low",
          risk:
            temp > 42
              ? "Critical"
              : temp > 39
              ? "High"
              : "Moderate",
          forecast: (temp + 2).toFixed(1),
        };
      })
    );

    setCities(updated);
    setLastUpdated(
      new Date().toLocaleTimeString()
    );
  }

  useEffect(() => {
    fetchLiveData();

    const interval =
      setInterval(fetchLiveData, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "#ef4444",
          color: "white",
          padding: "12px",
          borderRadius: "10px",
          zIndex: 1000,
        }}
      >
        🔴 LIVE DATA
        <br />
        {lastUpdated}
      </div>

      <MapContainer
        center={[22.5, 79]}
        zoom={4}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer cities={cities} />

        {cities.map((city) => (
          <Marker
            key={city.name}
            position={[
              city.lat,
              city.lon,
            ]}
          >
            <Popup>
              <h3>{city.name}</h3>

              <p>
                🌡 Temperature:
                <b>
                  {" "}
                  {city.temp}°C
                </b>
              </p>

              <p>
                🔥 Severity:
                <b>
                  {" "}
                  {city.severity}
                </b>
              </p>

              <p>
                🤖 AI Risk:
                <b>
                  {" "}
                  {city.risk}
                </b>
              </p>

              <p>
                📈 Forecast:
                <b>
                  {" "}
                  {city.forecast}°C
                </b>
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          zIndex: 1000,
        }}
      >
        <b>Heat Intensity</b>

        <div style={{ color: "#0066ff" }}>
          ● Cool
        </div>

        <div style={{ color: "#00ff88" }}>
          ● Mild
        </div>

        <div style={{ color: "#ffff00" }}>
          ● Moderate
        </div>

        <div style={{ color: "#ff8800" }}>
          ● High
        </div>

        <div style={{ color: "#ff0000" }}>
          ● Extreme
        </div>
      </div>
    </div>
  );
}