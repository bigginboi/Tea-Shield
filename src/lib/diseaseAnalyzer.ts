export type DiseaseType = 'redRust' | 'brownBlight' | 'blisterBlight' | 'healthy' | 'uncertain';

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface AnalysisResult {
  disease: DiseaseType;
  severity: SeverityLevel;
  severityPercentage: number;
  confidence: number;
  scores: Record<DiseaseType, number>;
  leafPixelCount: number;
  infectedPixelCount: number;
  processingTimeMs: number;
}

interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

// Convert RGB to HSV
function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const v = max * 100;

  if (delta !== 0) {
    s = (delta / max) * 100;

    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }

    if (h < 0) h += 360;
  }

  return { h, s, v };
}

// Check if pixel is likely part of a leaf (green-dominant)
function isLeafPixel(r: number, g: number, b: number): boolean {
  const hsv = rgbToHsv(r, g, b);
  
  // Leaf green typically has hue between 60-180, with reasonable saturation
  // Also include some yellow-green and darker greens
  const isGreenHue = hsv.h >= 40 && hsv.h <= 180;
  const hasSaturation = hsv.s >= 10;
  const hasBrightness = hsv.v >= 10 && hsv.v <= 95;
  
  // Also allow brown/diseased areas as part of leaf
  const isBrownish = hsv.h >= 0 && hsv.h <= 50 && hsv.s >= 15 && hsv.v >= 10 && hsv.v <= 70;
  const isReddish = hsv.h >= 0 && hsv.h <= 30 && hsv.s >= 20;
  const isWhitish = hsv.s <= 30 && hsv.v >= 60;
  
  return (isGreenHue && hasSaturation && hasBrightness) || isBrownish || isReddish || isWhitish;
}

// Disease classification rules based on HSV
function classifyPixel(hsv: HSV): DiseaseType {
  const { h, s, v } = hsv;

  // Red Rust: Reddish/rust-brown hue, high saturation, medium brightness
  // Hue: 0-30 (red to orange-brown), Saturation: 40+, Brightness: 30-70
  if ((h >= 0 && h <= 35) && s >= 35 && v >= 25 && v <= 75) {
    return 'redRust';
  }

  // Brown Blight: Dark brown or blackish spots, medium saturation, low brightness
  // Hue: 10-50 (brown range), Saturation: 20-60, Brightness: 10-40
  if ((h >= 10 && h <= 60) && s >= 15 && s <= 70 && v >= 5 && v <= 45) {
    return 'brownBlight';
  }

  // Blister/White Blight: Very low saturation, high brightness, pale/whitish
  // Any hue, Saturation: 0-25, Brightness: 65+
  if (s <= 28 && v >= 60) {
    return 'blisterBlight';
  }

  // Healthy: Green leaf tissue
  // Hue: 60-160 (green range), Saturation: 20+, Brightness: 20-80
  if (h >= 50 && h <= 165 && s >= 15 && v >= 15 && v <= 85) {
    return 'healthy';
  }

  return 'healthy'; // Default to healthy for ambiguous pixels
}

export async function analyzeLeafImage(imageData: ImageData): Promise<AnalysisResult> {
  const startTime = performance.now();
  
  const { data, width, height } = imageData;
  
  // Initialize scores
  const scores: Record<DiseaseType, number> = {
    redRust: 0,
    brownBlight: 0,
    blisterBlight: 0,
    healthy: 0,
    uncertain: 0,
  };

  let leafPixelCount = 0;
  let infectedPixelCount = 0;

  // Analyze each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Check if this is a leaf pixel
    if (!isLeafPixel(r, g, b)) continue;

    leafPixelCount++;

    const hsv = rgbToHsv(r, g, b);
    const classification = classifyPixel(hsv);
    
    scores[classification]++;
    
    if (classification !== 'healthy') {
      infectedPixelCount++;
    }
  }

  // Calculate result
  const processingTimeMs = performance.now() - startTime;

  // If no leaf pixels found
  if (leafPixelCount < 100) {
    return {
      disease: 'uncertain',
      severity: 'low',
      severityPercentage: 0,
      confidence: 0,
      scores,
      leafPixelCount,
      infectedPixelCount,
      processingTimeMs,
    };
  }

  // Find dominant disease
  const diseaseScores = {
    redRust: scores.redRust,
    brownBlight: scores.brownBlight,
    blisterBlight: scores.blisterBlight,
    healthy: scores.healthy,
  };

  const sortedDiseases = Object.entries(diseaseScores)
    .sort(([, a], [, b]) => b - a) as [DiseaseType, number][];

  const [topDisease, topScore] = sortedDiseases[0];
  const [, secondScore] = sortedDiseases[1];

  // Calculate confidence based on dominance margin
  const dominanceRatio = topScore / (topScore + secondScore + 1);
  const pixelCoverageRatio = leafPixelCount / (width * height);
  
  // Confidence factors:
  // 1. How dominant is the top disease (0-50%)
  // 2. Pixel coverage quality (0-30%)
  // 3. Minimum viable pixel count (0-20%)
  const dominanceConfidence = Math.min(dominanceRatio * 60, 60);
  const coverageConfidence = Math.min(pixelCoverageRatio * 100, 25);
  const countConfidence = Math.min(leafPixelCount / 5000, 1) * 15;
  
  let confidence = Math.round(dominanceConfidence + coverageConfidence + countConfidence);
  confidence = Math.min(Math.max(confidence, 0), 100);

  // Determine if result is certain enough
  const isUncertain = confidence < 40 || dominanceRatio < 0.45;
  
  // Calculate severity
  const severityPercentage = (infectedPixelCount / leafPixelCount) * 100;
  let severity: SeverityLevel;
  
  if (severityPercentage < 15) {
    severity = 'low';
  } else if (severityPercentage < 40) {
    severity = 'medium';
  } else {
    severity = 'high';
  }

  // If healthy is dominant, severity should be low
  if (topDisease === 'healthy') {
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
    disease: isUncertain ? 'uncertain' : topDisease,
    severity,
    severityPercentage: Math.round(severityPercentage * 10) / 10,
    confidence,
    scores,
    leafPixelCount,
    infectedPixelCount,
    processingTimeMs,
  };
}

export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 70) return 'high';
  if (confidence >= 50) return 'medium';
  return 'low';
}
