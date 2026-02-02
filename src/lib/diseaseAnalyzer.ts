/**
 * Tea Leaf Disease Analyzer - Tea-Shield
 * 
 * Accurate color-based detection for 7 tea leaf diseases
 * Based on Kaggle Tea Leaf Disease Dataset with exact color signatures
 */

export type DiseaseType = 
  | 'redRust'           // Red Rust - Reddish-brown pustules
  | 'algalLeafSpot'     // Algal Leaf Spot - Grayish-green to orange patches  
  | 'birdsEyeSpot'      // Bird's Eye Spot - Small spots with light centers
  | 'grayBlight'        // Gray Blight - Silvery-gray patches
  | 'blisterBlight'     // Blister/White Blight - Pale white/cream blisters
  | 'anthracnose'       // Anthracnose - Dark brown/black sunken lesions
  | 'brownBlight'       // Brown Blight - Dark brown circular spots with rings
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

// Convert RGB to HSV
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

/**
 * Disease Classification based on exact visual characteristics:
 * 
 * 1. RED RUST: Reddish-brown pustules, rusty powdery appearance
 * 2. BROWN BLIGHT: Dark brown/black circular spots with concentric rings, grayish centers
 * 3. BLISTER BLIGHT: Pale white/cream patches with raised blister-like areas
 * 4. GRAY BLIGHT: Silvery-gray spreading patches
 * 5. ANTHRACNOSE: Dark brown-black sunken spots
 * 6. BIRD'S EYE SPOT: Small circular spots with tan/cream centers and dark rings
 * 7. ALGAL LEAF SPOT: Grayish-green velvety patches, can be orange-red
 */
function classifyPixel(r: number, g: number, b: number): DiseaseType | null {
  const { h, s, v } = rgbToHsv(r, g, b);

  // Skip non-leaf pixels (background, overexposed, very dark)
  if (v < 8 || v > 98) return null;
  if (s < 5 && v > 90) return null; // Pure white background

  // ========== DISEASE DETECTION (by color distinctiveness) ==========

  // 1. RED RUST - Reddish-brown pustules giving rusty, powdery appearance
  // Color: Rust red to dark reddish-brown (like oxidized iron)
  // HSV: Hue 0-25 (red-orange), High saturation, Medium-low value
  if (h >= 0 && h <= 25 && s >= 35 && v >= 15 && v <= 60) {
    if (r > g * 1.2 && r > b * 1.3) {
      return 'redRust';
    }
  }
  // Also catch brighter rust spots
  if (h >= 5 && h <= 35 && s >= 45 && v >= 40 && v <= 75) {
    if (r > g && r > b && g > b * 0.7) {
      return 'redRust';
    }
  }

  // 2. BROWN BLIGHT - Dark brown/black circular spots with concentric rings
  // Color: Very dark brown to black, grayish centers
  // HSV: Low hue (0-40), medium saturation, very low value (dark)
  if (h >= 0 && h <= 40 && s >= 20 && s <= 70 && v >= 8 && v <= 35) {
    if (r >= g * 0.8 && r >= b && g > b * 0.6) {
      return 'brownBlight';
    }
  }
  // Concentric ring pattern - darker rings alternate with lighter brown
  if (h >= 15 && h <= 50 && s >= 30 && s <= 65 && v >= 25 && v <= 50) {
    if (r > g && r > b && g > b) {
      return 'brownBlight';
    }
  }

  // 3. BLISTER BLIGHT (White Spot) - Pale white/cream-colored patches with blisters
  // Color: Very pale, almost white, cream-colored raised areas
  // HSV: Any hue, very low saturation, very high value (whitish)
  if (s <= 20 && v >= 75) {
    // Cream/pale yellow tint
    if (r >= 180 && g >= 170 && b >= 150 && r >= b) {
      return 'blisterBlight';
    }
  }
  // Pure white blisters
  if (s <= 15 && v >= 80 && r > 200 && g > 200 && b > 190) {
    return 'blisterBlight';
  }

  // 4. GRAY BLIGHT - Silvery-gray patches spreading on leaves
  // Color: Gray to silver-gray, low saturation, balanced RGB
  // HSV: Low saturation (gray), medium value
  if (s >= 5 && s <= 25 && v >= 30 && v <= 70) {
    const rgbDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    if (rgbDiff < 35) { // Balanced gray
      return 'grayBlight';
    }
  }

  // 5. ANTHRACNOSE - Brown-black sunken spots
  // Color: Very dark brown to black, defined edges
  // HSV: Low hue, low-medium saturation, very low value (very dark)
  if (v >= 5 && v <= 25 && s >= 10 && s <= 50) {
    if (h >= 0 && h <= 60) {
      if (r < 80 && g < 70 && b < 60) {
        return 'anthracnose';
      }
    }
  }

  // 6. BIRD'S EYE SPOT - Small spots with light tan/cream centers and dark rings
  // Color: Light tan/cream centers (distinctive "eye" appearance)
  // HSV: Hue 25-50 (tan/cream), medium saturation, medium-high value
  if (h >= 25 && h <= 55 && s >= 20 && s <= 50 && v >= 55 && v <= 85) {
    if (r > g && g > b && r > 130 && g > 100) {
      return 'birdsEyeSpot';
    }
  }

  // 7. ALGAL LEAF SPOT - Grayish-green velvety patches, can turn orange-red
  // Color: Grayish-green (early) to orange-red crusty (mature)
  // HSV: Green-yellow hue, low-medium saturation
  if (h >= 70 && h <= 140 && s >= 15 && s <= 45 && v >= 25 && v <= 65) {
    // Grayish-green patches
    if (g >= r * 0.85 && g >= b * 0.9) {
      return 'algalLeafSpot';
    }
  }
  // Orange-red mature algal spots
  if (h >= 10 && h <= 40 && s >= 25 && s <= 55 && v >= 35 && v <= 60) {
    if (r > g && g > b * 0.8) {
      return 'algalLeafSpot';
    }
  }

  // ========== HEALTHY LEAF DETECTION ==========
  // Healthy tea leaves are dark to medium green
  if (h >= 60 && h <= 150 && s >= 25 && v >= 20 && v <= 80) {
    if (g >= r && g >= b) {
      return 'healthy';
    }
  }

  // Light green / yellowish-green (still healthy)
  if (h >= 45 && h <= 100 && s >= 30 && v >= 45) {
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

  // Use sampling for large images
  const sampleRate = totalPixels > 250000 ? Math.ceil(totalPixels / 100000) : 1;

  const scores: Record<DiseaseType, number> = {
    redRust: 0,
    algalLeafSpot: 0,
    birdsEyeSpot: 0,
    grayBlight: 0,
    blisterBlight: 0,
    anthracnose: 0,
    brownBlight: 0,
    healthy: 0,
    uncertain: 0,
  };

  let leafPixelCount = 0;
  let infectedPixelCount = 0;

  // Process pixels with sampling
  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    const classification = classifyPixel(r, g, b);
    if (classification === null) continue;

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

  if (healthyRatio > 0.85) {
    // Mostly healthy
    resultDisease = 'healthy';
    confidence = Math.round(Math.min(healthyRatio * 100, 95));
  } else if (diseaseRatio > 0.05 && topScore > 0) {
    // Disease detected - require at least 5% infected
    resultDisease = topDisease;
    
    // Confidence based on dominance of top disease
    const dominance = topScore / (infectedPixelCount + 1);
    confidence = Math.round(
      Math.min(95, Math.max(40, dominance * 65 + diseaseRatio * 35))
    );
  } else {
    // Ambiguous
    resultDisease = healthyRatio > 0.6 ? 'healthy' : 'uncertain';
    confidence = Math.round(Math.max(25, healthyRatio * 60));
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

  console.log('Tea-Shield Analysis:', {
    disease: resultDisease,
    confidence,
    severityPercentage,
    topScores: diseaseScores.slice(0, 3).map(([d, s]) => `${d}: ${s}`),
  });

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

// Disease names with exact terminology from Tea-Shield Guide
export const diseaseNames: Record<DiseaseType, { en: string; as: string; hi: string }> = {
  redRust: { 
    en: 'Red Rust', 
    as: 'ৰঙা মামৰ', 
    hi: 'लाल जंग' 
  },
  algalLeafSpot: { 
    en: 'Algal Leaf Spot', 
    as: 'শেলাই পাতৰ দাগ', 
    hi: 'शैवाल पत्ती धब्बा' 
  },
  birdsEyeSpot: { 
    en: "Bird's Eye Spot", 
    as: 'চৰাইৰ চকুৰ দাগ', 
    hi: 'बर्ड्स आई स्पॉट' 
  },
  grayBlight: { 
    en: 'Gray Blight', 
    as: 'ধূসৰ ব্লাইট', 
    hi: 'ग्रे ब्लाइट' 
  },
  blisterBlight: { 
    en: 'Blister Blight (White Spot)', 
    as: 'ব্লিষ্টাৰ ব্লাইট (বগা দাগ)', 
    hi: 'ब्लिस्टर ब्लाइट (सफेद धब्बा)' 
  },
  anthracnose: { 
    en: 'Anthracnose', 
    as: 'এন্থ্ৰাকন\'জ', 
    hi: 'एन्थ्रेक्नोज' 
  },
  brownBlight: { 
    en: 'Brown Blight', 
    as: 'বাদামী ব্লাইট', 
    hi: 'ब्राउन ब्लाइट' 
  },
  healthy: { 
    en: 'Healthy Leaf', 
    as: 'স্বাস্থ্যকৰ পাত', 
    hi: 'स्वस्थ पत्ता' 
  },
  uncertain: { 
    en: 'Uncertain - Please retake photo', 
    as: 'অনিশ্চিত - অনুগ্ৰহ কৰি পুনৰ ফটো লওক', 
    hi: 'अनिश्चित - कृपया फोटो दोबारा लें' 
  },
};
