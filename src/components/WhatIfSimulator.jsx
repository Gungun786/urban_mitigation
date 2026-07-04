import React, { useState } from "react";

export default function WhatIfSimulator() {
  const [trees, setTrees] = useState(20);
  const [coolRoof, setCoolRoof] = useState(20);
  const [water, setWater] = useState(10);
  const [green, setGreen] = useState(15);

  const currentTemp = 43.5;

  const reduction =
    trees * 0.05 +
    coolRoof * 0.04 +
    water * 0.06 +
    green * 0.03;

  const predictedTemp = Number(
    (currentTemp - reduction).toFixed(1)
  );

  const carbonSaved = Math.round(
    trees * 3 +
      green * 2 +
      water * 4 +
      coolRoof
  );

  const energySaved =
    Math.round(reduction * 4);

  const populationProtected =
    Math.round(reduction * 10000);

  const livesProtected =
    Math.round(reduction * 1200);

  const investment =
    Math.round(
      trees * 50 +
        coolRoof * 30 +
        water * 80 +
        green * 40
    );

  const projectedSavings =
    Math.round(investment * 2.8);

  const resilience = Math.min(
    100,
    Math.round(40 + reduction * 12)
  );

  const confidence = 92;

  const equivalentTrees =
    carbonSaved * 50;

  let risk;
  let riskColor;

  if (predictedTemp > 42) {
    risk = "Critical";
    riskColor = "#ef4444";
  } else if (predictedTemp > 39) {
    risk = "High";
    riskColor = "#f97316";
  } else {
    risk = "Moderate";
    riskColor = "#22c55e";
  }

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h1>🌍 HeatShield AI</h1>
      <h2>AI Mitigation Simulator</h2>

      <p
        style={{
          color: "#666",
          marginBottom: "25px",
        }}
      >
        Simulate urban heat mitigation
        strategies and predict their
        environmental impact.
      </p>

      {/* HEATSHIELD INDEX */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "white",
          padding: "25px",
          borderRadius: "15px",
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        <h2>🔥 HeatShield Index</h2>

        <h1
          style={{
            fontSize: "70px",
            color: "#22c55e",
            margin: 0,
          }}
        >
          {resilience}
        </h1>

        <p>
          Climate resilience improved by{" "}
          {Math.round(reduction * 6)}%
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "25px",
        }}
      >
        {/* CONTROLS */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            Mitigation Controls
          </h2>

          {[
            [
              "🌳 Tree Cover",
              trees,
              setTrees,
            ],
            [
              "🏠 Cool Roofs",
              coolRoof,
              setCoolRoof,
            ],
            [
              "💧 Water Bodies",
              water,
              setWater,
            ],
            [
              "🌿 Green Spaces",
              green,
              setGreen,
            ],
          ].map(
            (
              [
                label,
                value,
                setter,
              ],
              i
            ) => (
              <div
                key={i}
                style={{
                  marginTop:
                    "25px",
                }}
              >
                <h4>
                  {label}
                  ({value}%)
                </h4>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) =>
                    setter(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  style={{
                    width:
                      "100%",
                  }}
                />
              </div>
            )
          )}
        </div>

        {/* AI OUTPUT */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            🤖 AI Prediction
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "15px",
              marginTop:
                "20px",
            }}
          >
            {[
              [
                "Current Temp",
                `${currentTemp}°C`,
              ],
              [
                "Predicted Temp",
                `${predictedTemp}°C`,
              ],
              [
                "Reduction",
                `${reduction.toFixed(
                  1
                )}°C`,
              ],
              [
                "Carbon Saved",
                `${carbonSaved} tons`,
              ],
              [
                "Energy Saved",
                `${energySaved}%`,
              ],
              [
                "Population Protected",
                populationProtected.toLocaleString(),
              ],
              [
                "Lives Protected",
                livesProtected.toLocaleString(),
              ],
              [
                "Investment",
                `₹${investment} Cr`,
              ],
              [
                "Projected Savings",
                `₹${projectedSavings} Cr`,
              ],
              [
                "Climate Resilience",
                `${resilience}/100`,
              ],
              [
                "Equivalent Trees",
                equivalentTrees.toLocaleString(),
              ],
            ].map(
              (
                [
                  title,
                  value,
                ],
                i
              ) => (
                <div
                  key={i}
                  style={{
                    background:
                      "#f8fafc",
                    padding:
                      "15px",
                    borderRadius:
                      "10px",
                  }}
                >
                  <b>
                    {title}
                  </b>
                  <br />
                  {value}
                </div>
              )
            )}

            {/* AI CONFIDENCE */}
            <div
              style={{
                background:
                  "#f8fafc",
                padding:
                  "15px",
                borderRadius:
                  "10px",
              }}
            >
              <b>
                AI Confidence
              </b>

              <div
                style={{
                  background:
                    "#ddd",
                  height:
                    "15px",
                  borderRadius:
                    "10px",
                  marginTop:
                    "10px",
                }}
              >
                <div
                  style={{
                    width:
                      `${confidence}%`,
                    height:
                      "15px",
                    background:
                      "#22c55e",
                    borderRadius:
                      "10px",
                  }}
                />
              </div>

              <p>
                {confidence}%
              </p>
            </div>

            {/* RISK */}
            <div
              style={{
                background:
                  riskColor,
                color:
                  "white",
                padding:
                  "15px",
                borderRadius:
                  "10px",
                textAlign:
                  "center",
              }}
            >
              <h3>
                Heat Risk
              </h3>

              <h2>
                {risk}
              </h2>

              <p>
                {predictedTemp}
                °C
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BEFORE AFTER */}
      <div
        style={{
          background: "white",
          marginTop: "25px",
          padding: "25px",
          borderRadius: "15px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          🌡 Before vs After
          Simulation
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-around",
            marginTop: "30px",
            textAlign:
              "center",
          }}
        >
          <div>
            <h3>Before</h3>

            <div
              style={{
                width:
                  "120px",
                height:
                  `${currentTemp *
                    5}px`,
                background:
                  "#ef4444",
                borderRadius:
                  "10px",
                margin:
                  "auto",
              }}
            />

            <h2>
              {currentTemp}
              °C
            </h2>
          </div>

          <div>
            <h3>After</h3>

            <div
              style={{
                width:
                  "120px",
                height:
                  `${predictedTemp *
                    5}px`,
                background:
                  "#22c55e",
                borderRadius:
                  "10px",
                margin:
                  "auto",
              }}
            />

            <h2>
              {predictedTemp}
              °C
            </h2>
          </div>
        </div>
      </div>

      {/* AI EXPLAINABILITY */}
      <div
        style={{
          background: "white",
          marginTop: "25px",
          padding: "25px",
          borderRadius: "15px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          🧠 AI Decision
          Factors
        </h2>

        {[
          [
            "🌳 Tree Cover",
            45,
          ],
          [
            "🏠 Cool Roofs",
            30,
          ],
          [
            "💧 Water Bodies",
            15,
          ],
          [
            "🌿 Green Spaces",
            10,
          ],
        ].map(
          (
            [
              label,
              score,
            ]
          ) => (
            <div
              key={
                label
              }
              style={{
                marginTop:
                  "20px",
              }}
            >
              <b>
                {label}
              </b>

              <div
                style={{
                  background:
                    "#e5e7eb",
                  height:
                    "18px",
                  borderRadius:
                    "10px",
                  marginTop:
                    "8px",
                }}
              >
                <div
                  style={{
                    width:
                      `${score}%`,
                    background:
                      "#22c55e",
                    height:
                      "18px",
                    borderRadius:
                      "10px",
                  }}
                />
              </div>

              <small>
                {score}%
                contribution
              </small>
            </div>
          )
        )}
      </div>

      {/* RECOMMENDATIONS */}
      <div
        style={{
          background:
            "white",
          marginTop:
            "25px",
          padding:
            "25px",
          borderRadius:
            "15px",
        }}
      >
        <h2>
          🤖 AI
          Recommendations
        </h2>

        <ul
          style={{
            lineHeight:
              2,
          }}
        >
          <li>
            ⭐ Increase
            tree canopy
            by 25%
          </li>

          <li>
            ⭐ Expand
            cool roofs
          </li>

          <li>
            ⭐ Build
            urban water
            corridors
          </li>

          <li>
            ⭐ Develop
            green
            corridors
          </li>
        </ul>
      </div>

      {/* SDG */}
      <div
        style={{
          background:
            "white",
          marginTop:
            "25px",
          padding:
            "25px",
          borderRadius:
            "15px",
        }}
      >
        <h2>
          🌍 UN SDG
          Impact
        </h2>

        <ul
          style={{
            lineHeight:
              2,
          }}
        >
          <li>
            ✅ SDG 3:
            Good Health
          </li>

          <li>
            ✅ SDG 11:
            Sustainable
            Cities
          </li>

          <li>
            ✅ SDG 13:
            Climate
            Action
          </li>

          <li>
            ✅ SDG 15:
            Life on
            Land
          </li>
        </ul>
      </div>

      {/* VERDICT */}
      <div
        style={{
          marginTop:
            "25px",
          background:
            "#111827",
          color:
            "white",
          padding:
            "25px",
          borderRadius:
            "15px",
          textAlign:
            "center",
        }}
      >
        <h2>
          🤖 HEATSHIELD
          AI VERDICT
        </h2>

        <p
          style={{
            lineHeight:
              2,
          }}
        >
          Deploying
          these
          strategies
          can reduce
          urban
          temperature
          by{" "}
          <b>
            {reduction.toFixed(
              1
            )}
            °C
          </b>
          , protect{" "}
          <b>
            {livesProtected.toLocaleString()}
          </b>{" "}
          citizens,
          and reduce{" "}
          <b>
            {
              carbonSaved
            }
            tons
          </b>{" "}
          of carbon
          emissions
          annually.
        </p>

        <h2
          style={{
            color:
              "#22c55e",
          }}
        >
          ✅ IMPLEMENT
          IMMEDIATELY
        </h2>
      </div>
    </div>
  );
}