/**
 * Tea Leaf Disease Analyzer
 * 
 * Uses rule-based HSV color analysis to detect 7 common tea diseases:
 * - Red Leaf Spot
 * - Algal Leaf Spot
 * - Bird's Eye Spot
 * - Gray Blight
 * - White Spot / Blister Blight
 * - Anthracnose
 * - Brown Blight
 * 
 * Based on the Kaggle dataset: https://www.kaggle.com/datasets/shashwatwork/identifying-disease-in-tea-leafs
 */

export type DiseaseType = 
  | 'redLeafSpot'      // Red/rust colored spots
  | 'algalLeafSpot'    // Green-gray algal growth
  | 'birdsEyeSpot'     // Small circular spots with light center
  | 'grayBlight'       // Gray/silver patches
  | 'whiteSpot'        // White/pale spots (blister blight)
  | 'anthracnose'      // Dark brown/black lesions
  | 'brownBlight'      // Brown necrotic areas
  | 'healthy'
  | 'uncertain';

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

interface RGB {
  r: number;
  g: number;
  b: number;
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

// Check if pixel is likely part of a leaf
function isLeafPixel(r: number, g: number, b: number): boolean {
  const hsv = rgbToHsv(r, g, b);
  
  // Exclude very dark (background) and very bright (overexposed) pixels
  if (hsv.v < 8 || hsv.v > 98) return false;
  
  // Exclude very desaturated gray (background)
  if (hsv.s < 5 && hsv.v > 80) return false;
  
  // Green leaves: Hue 40-160, reasonable saturation
  const isGreen = hsv.h >= 40 && hsv.h <= 160 && hsv.s >= 10;
  
  // Diseased areas can be brown, red, gray, white
  const isBrown = hsv.h >= 0 && hsv.h <= 50 && hsv.s >= 10 && hsv.v >= 10 && hsv.v <= 75;
  const isRed = hsv.h >= 0 && hsv.h <= 25 && hsv.s >= 20;
  const isGray = hsv.s <= 25 && hsv.v >= 20 && hsv.v <= 80;
  const isWhitish = hsv.s <= 30 && hsv.v >= 55;
  
  return isGreen || isBrown || isRed || isGray || isWhitish;
}

// Disease classification based on HSV color analysis
function classifyPixel(rgb: RGB, hsv: HSV): DiseaseType {
  const { h, s, v } = hsv;
  const { r, g, b } = rgb;

  // Red Leaf Spot: Bright red/rust colored spots
  // Hue: 0-20 (red range), High saturation, medium-high brightness
  if ((h >= 0 && h <= 20) && s >= 40 && v >= 30 && v <= 80) {
    return 'redLeafSpot';
  }

  // Algal Leaf Spot: Greenish-gray with slightly bluish tint
  // Distinct from healthy green - more grayish/silvery
  if (h >= 80 && h <= 180 && s >= 8 && s <= 35 && v >= 30 && v <= 70) {
    // Check for grayish-green characteristic of algal growth
    if (Math.abs(g - b) < 30 && g > r) {
      return 'algalLeafSpot';
    }
  }

  // Bird's Eye Spot: Small spots with light tan/cream center
  // Light center: low saturation, high value
  if (s <= 25 && v >= 60 && v <= 90 && h >= 20 && h <= 50) {
    return 'birdsEyeSpot';
  }

  // Gray Blight: Silver/gray patches
  // Very low saturation, medium brightness
  if (s <= 20 && v >= 35 && v <= 75) {
    return 'grayBlight';
  }

  // White Spot / Blister Blight: Pale/white raised spots
  // Very low saturation, high brightness
  if (s <= 25 && v >= 70) {
    return 'whiteSpot';
  }

  // Anthracnose: Dark brown to black lesions
  // Brown-black hue, low-medium saturation, low brightness
  if (h >= 0 && h <= 40 && s >= 15 && s <= 60 && v >= 5 && v <= 35) {
    return 'anthracnose';
  }

  // Brown Blight: Brown necrotic areas
  // Brown hue, medium saturation, medium-low brightness
  if (h >= 15 && h <= 55 && s >= 20 && s <= 70 && v >= 15 && v <= 55) {
    return 'brownBlight';
  }

  // Healthy: Green leaf tissue
  // Green hue, good saturation, medium-high brightness
  if (h >= 50 && h <= 160 && s >= 20 && v >= 20 && v <= 85) {
    return 'healthy';
  }

  // Default to healthy for ambiguous green-ish pixels
  if (h >= 40 && h <= 170 && g > r && g > b) {
    return 'healthy';
  }

  return 'healthy';
}

export async function analyzeLeafImage(imageData: ImageData): Promise<AnalysisResult> {
  const startTime = performance.now();
  
  const { data, width, height } = imageData;
  
  // Initialize scores for all disease types
  const scores: Record<DiseaseType, number> = {
    redLeafSpot: 0,
    algalLeafSpot: 0,
    birdsEyeSpot: 0,
    grayBlight: 0,
    whiteSpot: 0,
    anthracnose: 0,
    brownBlight: 0,
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
    const classification = classifyPixel({ r, g, b }, hsv);
    
    scores[classification]++;
    
    if (classification !== 'healthy') {
      infectedPixelCount++;
    }
  }

  const processingTimeMs = performance.now() - startTime;

  // If insufficient leaf pixels detected
  if (leafPixelCount < 500) {
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

  // Find dominant disease (excluding healthy and uncertain)
  const diseaseOnlyScores = { ...scores };
  delete (diseaseOnlyScores as any).healthy;
  delete (diseaseOnlyScores as any).uncertain;

  const sortedDiseases = Object.entries(diseaseOnlyScores)
    .sort(([, a], [, b]) => b - a) as [DiseaseType, number][];

  const [topDisease, topDiseaseScore] = sortedDiseases[0];
  const healthyScore = scores.healthy;
  const totalDiseaseScore = infectedPixelCount;

  // Determine if leaf is primarily healthy
  const healthyRatio = healthyScore / leafPixelCount;
  const diseaseRatio = totalDiseaseScore / leafPixelCount;

  // Calculate confidence
  let confidence: number;
  let resultDisease: DiseaseType;

  if (healthyRatio > 0.85) {
    // Primarily healthy leaf
    resultDisease = 'healthy';
    confidence = Math.round(healthyRatio * 100);
  } else if (diseaseRatio > 0.1) {
    // Significant disease presence
    resultDisease = topDisease;
    
    // Confidence based on how dominant the disease is
    const dominanceRatio = topDiseaseScore / (totalDiseaseScore + 1);
    const coverageQuality = Math.min(leafPixelCount / 10000, 1);
    
    confidence = Math.round(
      (dominanceRatio * 50) + 
      (diseaseRatio * 30) + 
      (coverageQuality * 20)
    );
    confidence = Math.min(Math.max(confidence, 15), 95);
  } else {
    // Ambiguous - low disease signal
    resultDisease = healthyRatio > 0.5 ? 'healthy' : 'uncertain';
    confidence = Math.round(healthyRatio * 60);
  }

  // Check if result is too uncertain
  if (confidence < 30 && resultDisease !== 'healthy') {
    resultDisease = 'uncertain';
  }

  // Calculate severity percentage
  const severityPercentage = Math.round((infectedPixelCount / leafPixelCount) * 1000) / 10;
  
  let severity: SeverityLevel;
  if (severityPercentage < 15) {
    severity = 'low';
  } else if (severityPercentage < 40) {
    severity = 'medium';
  } else {
    severity = 'high';
  }

  // If healthy, reset severity
  if (resultDisease === 'healthy') {
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
    disease: resultDisease,
    severity,
    severityPercentage,
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

// Human-readable disease names
export const diseaseNames: Record<DiseaseType, { en: string; as: string; hi: string }> = {
  redLeafSpot: {
    en: 'Red Leaf Spot',
    as: 'ৰঙা পাতৰ দাগ',
    hi: 'लाल पत्ती धब्बा',
  },
  algalLeafSpot: {
    en: 'Algal Leaf Spot',
    as: 'শেলাই পাতৰ দাগ',
    hi: 'शैवाल पत्ती धब्बा',
  },
  birdsEyeSpot: {
    en: "Bird's Eye Spot",
    as: 'চৰাইৰ চকুৰ দাগ',
    hi: 'बर्ड्स आई स्पॉट',
  },
  grayBlight: {
    en: 'Gray Blight',
    as: 'ধূসৰ ব্লাইট',
    hi: 'ग्रे ब्लाइट',
  },
  whiteSpot: {
    en: 'White Spot / Blister Blight',
    as: 'বগা দাগ / ব্লিষ্টাৰ ব্লাইট',
    hi: 'सफेद धब्बा / ब्लिस्टर ब्लाइट',
  },
  anthracnose: {
    en: 'Anthracnose',
    as: 'এন্থ্ৰাকন\'জ',
    hi: 'एन्थ्रेक्नोज',
  },
  brownBlight: {
    en: 'Brown Blight',
    as: 'বাদামী ব্লাইট',
    hi: 'ब्राउन ब्लाइट',
  },
  healthy: {
    en: 'Healthy',
    as: 'স্বাস্থ্যকৰ',
    hi: 'स्वस्थ',
  },
  uncertain: {
    en: 'Uncertain',
    as: 'অনিশ্চিত',
    hi: 'अनिश्चित',
  },
};
