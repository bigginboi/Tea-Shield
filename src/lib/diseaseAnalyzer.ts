/**
 * Tea Leaf Disease Analyzer - Optimized for Speed
 * 
 * Uses rule-based HSV color analysis to detect 7 common tea diseases.
 * Optimized with pixel sampling for instant results.
 */

export type DiseaseType = 
  | 'redLeafSpot'
  | 'algalLeafSpot'
  | 'birdsEyeSpot'
  | 'grayBlight'
  | 'whiteSpot'
  | 'anthracnose'
  | 'brownBlight'
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

// Convert RGB to HSV - optimized inline version
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
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
    if (max === r1) {
      h = 60 * (((g1 - b1) / delta) % 6);
    } else if (max === g1) {
      h = 60 * ((b1 - r1) / delta + 2);
    } else {
      h = 60 * ((r1 - g1) / delta + 4);
    }
    if (h < 0) h += 360;
  }

  return { h, s, v };
}

// Disease detection based on Kaggle Tea Leaf Disease Dataset
// 7 diseases: Anthracnose, Algal Leaf Spot, Bird's Eye Spot, Brown Blight, Gray Blight, Red Leaf Spot, White Spot

function classifyPixel(r: number, g: number, b: number): DiseaseType | null {
  const { h, s, v } = rgbToHsv(r, g, b);

  // Skip non-leaf pixels (background, overexposed, very dark)
  if (v < 10 || v > 97) return null;
  if (s < 8 && v > 85) return null; // Pure white background

  // === DISEASE DETECTION (ordered by distinctiveness) ===

  // 1. RED LEAF SPOT - Distinctive reddish-brown circular spots
  // Characterized by rusty red to dark red-brown coloration
  if (h >= 0 && h <= 30 && s >= 40 && v >= 20 && v <= 70) {
    if (r > g && r > b * 0.9) {
      return 'redLeafSpot';
    }
  }

  // 2. ANTHRACNOSE - Dark brown to black necrotic lesions with defined margins
  // Very dark, low saturation, brownish-black areas
  if (v >= 8 && v <= 35 && s >= 15 && s <= 60) {
    if (h >= 0 && h <= 50) {
      return 'anthracnose';
    }
  }

  // 3. BROWN BLIGHT - Irregular brown patches, often at leaf margins
  // Medium brown coloration, moderate saturation
  if (h >= 15 && h <= 45 && s >= 25 && s <= 70 && v >= 25 && v <= 55) {
    if (r > g * 0.8 && r > b) {
      return 'brownBlight';
    }
  }

  // 4. WHITE SPOT (Blister Blight) - Pale/whitish raised blisters
  // Very low saturation, high value (whitish areas)
  if (s <= 25 && v >= 70 && v <= 98) {
    return 'whiteSpot';
  }

  // 5. GRAY BLIGHT - Grayish-silver patches with dark margins
  // Low saturation, medium value (gray appearance)
  if (s >= 8 && s <= 30 && v >= 35 && v <= 70) {
    if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
      return 'grayBlight';
    }
  }

  // 6. BIRD'S EYE SPOT - Small circular spots with tan/cream centers and dark rings
  // Light tan/cream center areas
  if (h >= 20 && h <= 50 && s >= 15 && s <= 45 && v >= 50 && v <= 85) {
    if (r > g && g > b) {
      return 'birdsEyeSpot';
    }
  }

  // 7. ALGAL LEAF SPOT (Red Rust) - Grayish-green to orange-red crusty patches
  // Unique grayish-green or orange tint from algae
  if (h >= 60 && h <= 160 && s >= 10 && s <= 45 && v >= 30 && v <= 70) {
    if (Math.abs(g - b) < 40 && g >= r * 0.8) {
      return 'algalLeafSpot';
    }
  }

  // === HEALTHY LEAF DETECTION ===
  // Healthy tea leaves are typically dark to medium green
  if (h >= 50 && h <= 160 && s >= 20 && v >= 15 && v <= 85) {
    if (g >= r && g >= b) {
      return 'healthy';
    }
  }

  // Light green / yellowish-green (still healthy)
  if (h >= 40 && h <= 90 && s >= 25 && v >= 40) {
    if (g > r && g > b) {
      return 'healthy';
    }
  }

  return null;
}

// Main analysis function - optimized with sampling
export function analyzeLeafImage(imageData: ImageData): AnalysisResult {
  const startTime = performance.now();
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  // Use sampling for large images (sample every Nth pixel)
  // For a 1024x1024 image (1M pixels), we sample ~100k pixels
  const sampleRate = totalPixels > 250000 ? Math.ceil(totalPixels / 100000) : 1;

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
  let sampledCount = 0;

  // Process pixels with sampling
  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    const classification = classifyPixel(r, g, b);
    if (classification === null) continue;

    sampledCount++;
    leafPixelCount++;
    scores[classification]++;

    if (classification !== 'healthy') {
      infectedPixelCount++;
    }
  }

  // Scale up counts if we sampled
  if (sampleRate > 1) {
    leafPixelCount *= sampleRate;
    infectedPixelCount *= sampleRate;
    Object.keys(scores).forEach(key => {
      scores[key as DiseaseType] *= sampleRate;
    });
  }

  const processingTimeMs = performance.now() - startTime;

  // Not enough leaf pixels
  if (leafPixelCount < 500) {
    return {
      disease: 'uncertain',
      severity: 'low',
      severityPercentage: 0,
      confidence: 10,
      scores,
      leafPixelCount,
      infectedPixelCount,
      processingTimeMs,
    };
  }

  // Find the dominant disease
  const healthyScore = scores.healthy;
  const healthyRatio = healthyScore / leafPixelCount;

  // Get disease scores only
  const diseaseScores = Object.entries(scores)
    .filter(([key]) => key !== 'healthy' && key !== 'uncertain')
    .sort(([, a], [, b]) => b - a);

  const [topDisease, topScore] = diseaseScores[0] as [DiseaseType, number];
  const diseaseRatio = infectedPixelCount / leafPixelCount;

  let resultDisease: DiseaseType;
  let confidence: number;

  if (healthyRatio > 0.80) {
    // Mostly healthy
    resultDisease = 'healthy';
    confidence = Math.round(Math.min(healthyRatio * 100, 95));
  } else if (diseaseRatio > 0.08 && topScore > 0) {
    // Disease detected
    resultDisease = topDisease;
    
    // Confidence based on dominance
    const dominance = topScore / (infectedPixelCount + 1);
    confidence = Math.round(
      Math.min(95, Math.max(35, dominance * 60 + diseaseRatio * 40))
    );
  } else {
    // Ambiguous
    resultDisease = healthyRatio > 0.5 ? 'healthy' : 'uncertain';
    confidence = Math.round(Math.max(20, healthyRatio * 50));
  }

  // Calculate severity
  const severityPercentage = Math.round(diseaseRatio * 1000) / 10;
  let severity: SeverityLevel;
  
  if (severityPercentage < 15) {
    severity = 'low';
  } else if (severityPercentage < 40) {
    severity = 'medium';
  } else {
    severity = 'high';
  }

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

export const diseaseNames: Record<DiseaseType, { en: string; as: string; hi: string }> = {
  redLeafSpot: { en: 'Red Leaf Spot', as: 'ৰঙা পাতৰ দাগ', hi: 'लाल पत्ती धब्बा' },
  algalLeafSpot: { en: 'Algal Leaf Spot', as: 'শেলাই পাতৰ দাগ', hi: 'शैवाल पत्ती धब्बा' },
  birdsEyeSpot: { en: "Bird's Eye Spot", as: 'চৰাইৰ চকুৰ দাগ', hi: 'बर्ड्स आई स्पॉट' },
  grayBlight: { en: 'Gray Blight', as: 'ধূসৰ ব্লাইট', hi: 'ग्रे ब्लाइट' },
  whiteSpot: { en: 'White Spot / Blister Blight', as: 'বগা দাগ / ব্লিষ্টাৰ ব্লাইট', hi: 'सफेद धब्बा / ब्लिस्टर ब्लाइट' },
  anthracnose: { en: 'Anthracnose', as: 'এন্থ্ৰাকন\'জ', hi: 'एन्थ्रेक्नोज' },
  brownBlight: { en: 'Brown Blight', as: 'বাদামী ব্লাইট', hi: 'ब्राउन ब्लाइट' },
  healthy: { en: 'Healthy', as: 'স্বাস্থ্যকৰ', hi: 'स्वस्थ' },
  uncertain: { en: 'Uncertain', as: 'অনিশ্চিত', hi: 'अनिश्चित' },
};
