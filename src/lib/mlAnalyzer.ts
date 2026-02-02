import type { AnalysisResult, DiseaseType, SeverityLevel } from '@/lib/diseaseAnalyzer';

type Hsv = { h: number; s: number; v: number };

function rgbToHsv(r: number, g: number, b: number): Hsv {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;

  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  if (delta !== 0) {
    if (max === r1) h = 60 * (((g1 - b1) / delta) % 6);
    else if (max === g1) h = 60 * ((b1 - r1) / delta + 2);
    else h = 60 * ((r1 - g1) / delta + 4);
    if (h < 0) h += 360;
  }

  return { h, s, v };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isLeafLikePixel(h: number, s: number, v: number, r: number, g: number, b: number): boolean {
  if (v < 8 || v > 98) return false;
  if (s < 10 && v > 85) return false; // background / paper

  const isGreenish = h >= 35 && h <= 175 && g >= r * 0.75;
  const isBrownish = h <= 70 && s >= 10 && v <= 90;
  const isGrayish = s <= 25 && v >= 20 && v <= 85;
  return isGreenish || isBrownish || isGrayish;
}

function isHealthyGreen(h: number, s: number, v: number, r: number, g: number, b: number): boolean {
  if (h < 45 || h > 165) return false;
  if (s < 18) return false;
  if (v < 12 || v > 90) return false;
  return g >= r && g >= b;
}

export function analyzeTeaLeafImage(imageData: ImageData): AnalysisResult {
  const startTime = performance.now();
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  // sampling to stay fast
  const sampleRate = totalPixels > 250000 ? Math.ceil(totalPixels / 100000) : 1;

  let leafPixelCount = 0;
  let healthyCount = 0;

  let redLeafSpotCount = 0;
  let algalLeafSpotCount = 0;
  let birdsEyeSpotCount = 0;
  let grayBlightCount = 0;
  let whiteSpotCount = 0;
  let anthracnoseCount = 0;
  let brownBlightCount = 0;

  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue;

    const { h, s, v } = rgbToHsv(r, g, b);
    if (!isLeafLikePixel(h, s, v, r, g, b)) continue;
    leafPixelCount++;

    if (isHealthyGreen(h, s, v, r, g, b)) {
      healthyCount++;
      continue;
    }

    // Red Leaf Spot
    if (h >= 0 && h <= 28 && s >= 35 && v >= 18 && v <= 75 && r > g && r >= b * 0.85) {
      redLeafSpotCount++;
    }

    // Anthracnose
    if (v <= 28 && s >= 12 && s <= 65 && h <= 60) {
      anthracnoseCount++;
    }

    // Brown Blight
    if (h >= 12 && h <= 55 && s >= 18 && s <= 75 && v >= 18 && v <= 62 && r >= g * 0.8 && r >= b) {
      brownBlightCount++;
    }

    // White Spot / Blister Blight
    if (v >= 78 && s <= 18) {
      const isNearWhite = Math.abs(r - g) < 25 && Math.abs(g - b) < 25;
      if (isNearWhite) whiteSpotCount++;
    }

    // Gray Blight
    if (s <= 22 && v >= 30 && v <= 75) {
      const nearGray = Math.abs(r - g) < 28 && Math.abs(g - b) < 28;
      if (nearGray) grayBlightCount++;
    }

    // Bird's Eye Spot
    if (h >= 18 && h <= 55 && s >= 12 && s <= 45 && v >= 50 && v <= 90 && r >= g && g >= b) {
      birdsEyeSpotCount++;
    }

    // Algal Leaf Spot
    if (h >= 60 && h <= 170 && s >= 8 && s <= 45 && v >= 25 && v <= 75) {
      if (g >= r && g >= b && Math.abs(g - b) < 55) {
        algalLeafSpotCount++;
      }
    }
  }

  if (sampleRate > 1) {
    leafPixelCount *= sampleRate;
    healthyCount *= sampleRate;
    redLeafSpotCount *= sampleRate;
    algalLeafSpotCount *= sampleRate;
    birdsEyeSpotCount *= sampleRate;
    grayBlightCount *= sampleRate;
    whiteSpotCount *= sampleRate;
    anthracnoseCount *= sampleRate;
    brownBlightCount *= sampleRate;
  }

  const processingTimeMs = performance.now() - startTime;

  const scores: Record<DiseaseType, number> = {
    redLeafSpot: redLeafSpotCount,
    algalLeafSpot: algalLeafSpotCount,
    birdsEyeSpot: birdsEyeSpotCount,
    grayBlight: grayBlightCount,
    whiteSpot: whiteSpotCount,
    anthracnose: anthracnoseCount,
    brownBlight: brownBlightCount,
    healthy: healthyCount,
    uncertain: 0,
  };

  if (leafPixelCount < 500) {
    return {
      disease: 'uncertain',
      severity: 'low',
      severityPercentage: 0,
      confidence: 10,
      scores,
      leafPixelCount,
      infectedPixelCount: 0,
      processingTimeMs,
    };
  }

  const healthyRatio = healthyCount / leafPixelCount;
  const diseaseAreaRatio = clamp(1 - healthyRatio, 0, 1);
  const severityPercentage = Math.round(diseaseAreaRatio * 1000) / 10;

  type DiseaseClass = Exclude<DiseaseType, 'healthy' | 'uncertain'>;

  const diseaseRatios: Array<[DiseaseClass, number]> = [
    ['redLeafSpot', clamp(redLeafSpotCount / leafPixelCount, 0, 1)],
    ['algalLeafSpot', clamp(algalLeafSpotCount / leafPixelCount, 0, 1)],
    ['birdsEyeSpot', clamp(birdsEyeSpotCount / leafPixelCount, 0, 1)],
    ['grayBlight', clamp(grayBlightCount / leafPixelCount, 0, 1)],
    ['whiteSpot', clamp(whiteSpotCount / leafPixelCount, 0, 1)],
    ['anthracnose', clamp(anthracnoseCount / leafPixelCount, 0, 1)],
    ['brownBlight', clamp(brownBlightCount / leafPixelCount, 0, 1)],
  ];

  diseaseRatios.sort((a, b) => b[1] - a[1]);

  const [topDisease, topRatio] = diseaseRatios[0];
  const secondRatio = diseaseRatios[1]?.[1] ?? 0;

  let disease: DiseaseType = 'uncertain';
  let confidence = 20;

  if (healthyRatio >= 0.82 && topRatio < 0.06) {
    disease = 'healthy';
    confidence = Math.round(clamp(healthyRatio * 100, 40, 95));
  } else if (topRatio >= 0.04) {
    disease = topDisease;
    const separation = clamp((topRatio - secondRatio) * 250, 0, 35);
    const areaBoost = clamp(diseaseAreaRatio * 70, 0, 45);
    const topBoost = clamp(topRatio * 220, 0, 60);
    confidence = Math.round(clamp(30 + separation + areaBoost + topBoost, 35, 95));
  } else {
    disease = diseaseAreaRatio < 0.25 ? 'healthy' : 'uncertain';
    confidence = Math.round(clamp(healthyRatio * 60, 20, 55));
  }

  let severity: SeverityLevel;
  if (severityPercentage < 15) severity = 'low';
  else if (severityPercentage < 40) severity = 'medium';
  else severity = 'high';

  const infectedPixelCount = disease === 'healthy' ? 0 : Math.round(leafPixelCount * diseaseAreaRatio);

  // eslint-disable-next-line no-console
  console.log('Tea ML debug:', {
    disease,
    confidence,
    healthyRatio: Number(healthyRatio.toFixed(3)),
    topDisease,
    topRatio: Number(topRatio.toFixed(3)),
    secondRatio: Number(secondRatio.toFixed(3)),
  });

  if (disease === 'healthy') {
    return {
      disease: 'healthy',
      severity: 'low',
      severityPercentage: 0,
      confidence,
      scores,
      leafPixelCount,
      infectedPixelCount: 0,
      processingTimeMs,
    };
  }

  return {
    disease,
    severity,
    severityPercentage,
    confidence,
    scores,
    leafPixelCount,
    infectedPixelCount,
    processingTimeMs,
  };
}
