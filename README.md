# HeatShield - Urban Heat Mitigation Platform

HeatShield is an interactive React-based climate resilience dashboard designed for urban planners. It combines satellite imagery indices, land surface temperature datasets, and local meteorology inputs to identify high-risk heat corridors and simulate the cooling impact of physical interventions (tree planting, cool roofs, and green corridors) in real-time.

The application map and coordinates are locked strictly to **India (specifically New Delhi)**.

---

## Core Features

1. **Geospatial Hotspot Map**:
   - Built on Leaflet.js with a dark-matter style from CartoDB.
   - Centered on New Delhi, India.
   - Constrained to India bounds (`maxBounds`) to restrict panning/scrolling outside the country.
   - Interactive polygons representing New Delhi wards (Connaught Place, Okhla, Karol Bagh, Dwarka, Sanjay Van).
   - Dynamic overlay filters: **Surface Temperature** (heat indices), **Social Vulnerability Index** (density, income, demographics), and **Action Priorities** (high heat + high density zones).
2. **Physical Mitigation Sandbox**:
   - Interactive sliders to dynamically scale tree planting canopy %, cool roofs conversion %, and reflective pavements/greenways %.
   - Real-time physics simulation showing land surface temperature cooling response, peak energy load reductions, and carbon offset rates.
3. **Plan Optimizer**:
   - Click "Optimize Plan" to run a local optimization routine that fits tree canopy, albedo ratios, and urban buffer corridors based on the ward's priority profile.
4. **24h Temperature Forecast Chart**:
   - Custom-animated SVG chart showing diurnal temperature fluctuations.
   - Responds dynamically to planner inputs: as you apply mitigations, the projected cooling curve drops in real-time.
5. **Key Data Sources Panel**:
   - Embedded status feeds for ISRO Landsat-9, Sentinel-2, local meteorological stations, and IoT ground sensor meshes.
   - Live-scrolling log ticker of active system status alerts and model predictions.

---

## Technical Architecture & Model Equations

The local simulator runs on the following physical and empirical models:
- **Temperature Response**: 
  $$\Delta T = - (0.16 \times \Delta\text{Canopy}\%) - (4.5 \times \Delta\text{Albedo}) - (0.09 \times \Delta\text{Water}\%)$$
  This predicts land surface temperature reductions from adding shaded leaf canopy, boosting solar reflectance (cool roofs), and increasing evaporative buffers (green corridors).
- **Social Vulnerability Index (SVI)**:
  Resilience improves ($SVI$ drops) proportionally to temperature reductions:
  $$\Delta SVI = 2.8 \times \Delta T$$
- **Energy Load Relief**:
  $$\text{Savings}\% = 0.4 \times \Delta\text{Canopy}\% + 0.2 \times \Delta\text{Albedo}\% + 0.15 \times \Delta\text{Water}\%$$
  Reflects cooling load offsets for building HVAC units due to reduced ambient heat and shading.

---

## Getting Started

### Prerequisites
Make sure you have Node.js installed on your system.

### Running Locally
1. Open your terminal in the project directory:
   ```bash
   cd urban-heat-resilience
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the address shown (usually `http://localhost:5173`).

---

## Presentation Pitch Guide
1. **Explain the Real-Time Advantage**: Emphasize how traditional physical thermodynamics modeling takes hours or days to simulate a city block's thermal profile. Explain that HeatShield leverages statistical regression formulas to perform high-resolution predictions instantly (in under 1ms), enabling real-time planner interactions.
2. **Show before-and-after**: Select **Connaught Place / Central (Ward A)**, show the critical temperature (43.8°C) and the high vulnerability score. Click "Optimize Plan" or drag the tree canopy and cool roofs sliders to watch the map turn cooler (orange/yellow/green) and see energy savings climb.
3. **Explain the Overlay Layers**: Switch between Surface Temp, Social Vulnerability, and Priority overlays to demonstrate how the system focuses resources equitably on high-density, low-canopy wards first.
