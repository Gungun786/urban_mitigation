import React, { useState } from "react";

export default function MitigationSimulator() {
  const [trees, setTrees] = useState(20);
  const [coolRoof, setCoolRoof] = useState(15);
  const [water, setWater] = useState(10);

  const baseTemp = 43.8;

  // AI simulation formula
  const reduction =
    trees * 0.04 +
    coolRoof * 0.03 +
    water * 0.05;

  const projectedTemp = (baseTemp - reduction).toFixed(1);

  const carbonSaved = Math.round(
    trees * 3 +
    coolRoof * 2 +
    water * 4
  );

  const risk =
    projectedTemp > 42
      ? "Critical"
      : projectedTemp > 39
      ? "High"
      : "Moderate";

  const riskColor =
    projectedTemp > 42
      ? "#ef4444"
      : projectedTemp > 39
      ? "#f97316"
      : "#22c55e";

  return (
    <div
      style={{
        padding: "30px",
        background: "#f6f9f6",
        
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          marginBottom: "10px",
        }}
      >
        🌍 Heat Mitigation Simulator
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Simulate cooling interventions and analyze
        their impact on Urban Heat Islands.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Mitigation Controls</h2>

          <div style={{ marginTop: "30px" }}>
            <h4>
              🌳 Tree Plantation: {trees}%
            </h4>

            <input
              type="range"
              min="0"
              max="100"
              value={trees}
              onChange={(e) =>
                setTrees(Number(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginTop: "30px" }}>
            <h4>
              🏠 Cool Roof Coverage:
              {" "}{coolRoof}%
            </h4>

            <input
              type="range"
              min="0"
              max="100"
              value={coolRoof}
              onChange={(e) =>
                setCoolRoof(
                  Number(e.target.value)
                )
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginTop: "30px" }}>
            <h4>
              💧 Water Bodies:
              {" "}{water}%
            </h4>

            <input
              type="range"
              min="0"
              max="100"
              value={water}
              onChange={(e) =>
                setWater(
                  Number(e.target.value)
                )
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2>
            🤖 AI Impact Prediction
          </h2>

          <div
            style={{
              marginTop: "25px",
              display: "grid",
              gap: "15px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <b>Current Temperature</b>
              <br />
              {baseTemp}°C
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <b>Projected Temperature</b>
              <br />
              {projectedTemp}°C
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <b>Temperature Reduction</b>
              <br />
              -
              {(
                baseTemp -
                projectedTemp
              ).toFixed(1)}
              °C
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <b>Carbon Saved</b>
              <br />
              {carbonSaved}
              {" "}tons/year
            </div>

            <div
              style={{
                background: riskColor,
                color: "white",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <b>Heat Risk Level</b>
              <br />
              {risk}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div
        style={{
          background: "white",
          padding: "25px",
          marginTop: "25px",
          borderRadius: "15px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          🤖 HeatShield AI Recommendations
        </h2>

        <ul
          style={{
            marginTop: "20px",
            lineHeight: "2",
          }}
        >
          <li>
            Increase urban tree canopy
            by 20–30%
          </li>

          <li>
            Deploy reflective cool
            roofing materials
          </li>

          <li>
            Develop localized water
            retention zones
          </li>

          <li>
            Replace asphalt with
            reflective pavements
          </li>

          <li>
            Introduce green corridors
            connecting hot zones
          </li>
        </ul>
      </div>
    </div>
  );
}