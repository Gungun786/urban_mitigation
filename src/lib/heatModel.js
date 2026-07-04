export function calculateHeatImpact(ward, treeDelta = 0, roofDelta = 0, waterDelta = 0) {
  const tempReduction = (treeDelta * 0.16) + (roofDelta * 0.045) + (waterDelta * 0.09);
  const currentTemp = Math.max(30.0, ward.baseTemp - tempReduction);
  const canopy = ward.baseCanopy + treeDelta;
  const albedo = Math.min(0.6, ward.baseAlbedo + (roofDelta / 100) * 0.42);
  const vulnerability = Math.max(10, ward.baseVulnerability - tempReduction * 2.8);
  const energySavings = (treeDelta * 0.4) + (roofDelta * 0.2) + (waterDelta * 0.15);
  const comfortLift = (treeDelta * 0.5) + (roofDelta * 0.25) + (waterDelta * 0.35);
  const projectedCooling = Math.max(0.4, tempReduction + (roofDelta / 100) * 0.6);

  const recommendation = buildRecommendation({
    currentTemp,
    canopy,
    vulnerability,
    priority: ward.priority,
  });

  return {
    ...ward,
    treeDelta,
    roofDelta,
    waterDelta,
    currentTemp,
    canopy,
    albedo,
    vulnerability,
    energySavings,
    comfortLift,
    projectedCooling,
    recommendation,
    recommendationSummary: recommendation.summary,
    recommendedActions: recommendation.actions,
    predictionSeries: buildTemperatureTrend(currentTemp, projectedCooling),
  };
}

export function buildRecommendation({ currentTemp, canopy, vulnerability, priority }) {
  const actions = [];

  if (currentTemp >= 44 || vulnerability >= 75) {
    actions.push('Prioritize cool roofs and shaded transit corridors');
  }

  if (canopy < 12) {
    actions.push('Expand tree canopy in public spaces and school zones');
  }

  if (vulnerability >= 65) {
    actions.push('Protect vulnerable communities with cooling shelters');
  }

  if (actions.length === 0) {
    actions.push('Maintain existing green infrastructure and monitor heat peaks');
  }

  const summary =
    priority === 'High'
      ? 'High-risk area: start with cool roofs, targeted shade trees, and water-friendly greenways.'
      : 'Balanced strategy: strengthen canopy cover and reflective surfaces to keep the area comfortable.';

  return { actions, summary };
}

export function buildTemperatureTrend(currentTemp, projectedCooling) {
  const base = Number(currentTemp || 0);
  const cooling = Number(projectedCooling || 0);

  return [
    { label: 'Now', temp: Number(base.toFixed(1)) },
    { label: '+3h', temp: Number(Math.max(30, base - cooling * 0.4).toFixed(1)) },
    { label: '+6h', temp: Number(Math.max(30, base - cooling * 0.75).toFixed(1)) },
    { label: '+12h', temp: Number(Math.max(30, base - cooling * 1.1).toFixed(1)) },
  ];
}
