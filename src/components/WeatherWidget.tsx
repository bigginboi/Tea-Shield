import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  temperature: number;
  humidity: number;
  conditions: string;
  icon: 'sun' | 'cloud' | 'rain';
}

interface TeaWeatherAssessment {
  status: 'good' | 'moderate' | 'bad';
  advice: string;
}

// Simulated weather based on realistic patterns
function getSimulatedWeather(): WeatherData {
  const hour = new Date().getHours();
  const month = new Date().getMonth();
  
  // Base temperature varies by time of day and season
  let baseTemp = 22;
  if (month >= 10 || month <= 2) baseTemp = 18; // Winter
  if (month >= 3 && month <= 5) baseTemp = 26; // Spring/Summer
  if (month >= 6 && month <= 9) baseTemp = 24; // Monsoon
  
  // Time of day variation
  if (hour >= 6 && hour < 10) baseTemp -= 3;
  if (hour >= 10 && hour < 14) baseTemp += 4;
  if (hour >= 14 && hour < 18) baseTemp += 2;
  if (hour >= 18 || hour < 6) baseTemp -= 4;
  
  // Add some randomness
  const temp = baseTemp + Math.floor(Math.random() * 6) - 3;
  
  // Humidity (higher during monsoon)
  let baseHumidity = 65;
  if (month >= 6 && month <= 9) baseHumidity = 85;
  if (month >= 10 || month <= 2) baseHumidity = 55;
  const humidity = Math.min(95, Math.max(40, baseHumidity + Math.floor(Math.random() * 20) - 10));
  
  // Conditions based on humidity and season
  let conditions: string;
  let icon: 'sun' | 'cloud' | 'rain';
  
  if (humidity > 80) {
    conditions = month >= 6 && month <= 9 ? 'Rainy' : 'Overcast';
    icon = humidity > 85 ? 'rain' : 'cloud';
  } else if (humidity > 60) {
    conditions = 'Partly Cloudy';
    icon = 'cloud';
  } else {
    conditions = 'Sunny';
    icon = 'sun';
  }
  
  return { temperature: temp, humidity, conditions, icon };
}

function assessTeaWeather(weather: WeatherData, lang: string): TeaWeatherAssessment {
  const { temperature, humidity } = weather;
  
  // Ideal conditions for tea: 20-30°C, 70-90% humidity
  const tempOk = temperature >= 18 && temperature <= 32;
  const humidityIdeal = humidity >= 60 && humidity <= 85;
  const humidityRisk = humidity > 90; // High disease risk
  
  // Disease risk assessment
  if (humidityRisk && temperature > 15 && temperature < 28) {
    // High humidity + moderate temp = blister blight risk
    const advice = {
      en: 'High humidity increases disease risk. Monitor for blister blight. Avoid plucking wet leaves.',
      as: 'উচ্চ আৰ্দ্ৰতাই ৰোগৰ আশংকা বঢ়ায়। ব্লিষ্টাৰ ব্লাইটৰ বাবে নিৰীক্ষণ কৰক। তিতা পাত ছিঙা এৰাই চলক।',
      hi: 'उच्च नमी से रोग का खतरा बढ़ता है। ब्लिस्टर ब्लाइट के लिए निगरानी करें। गीली पत्तियां तोड़ने से बचें।',
    };
    return { status: 'bad', advice: advice[lang as keyof typeof advice] || advice.en };
  }
  
  if (!tempOk) {
    const advice = {
      en: temperature < 18 
        ? 'Cool weather may slow growth. Protect young shoots from frost if temperature drops further.'
        : 'High temperature may stress plants. Ensure adequate irrigation and shade.',
      as: temperature < 18
        ? 'শীতল বতৰে বৃদ্ধি লেহেম কৰিব পাৰে। তাপমাত্ৰা আৰু কমিলে কোমল কোঁহবোৰ তুষাৰৰ পৰা ৰক্ষা কৰক।'
        : 'উচ্চ তাপমাত্ৰাই গছত চাপ পেলাব পাৰে। পৰ্যাপ্ত জলসিঞ্চন আৰু ছাঁ নিশ্চিত কৰক।',
      hi: temperature < 18
        ? 'ठंडे मौसम से विकास धीमा हो सकता है। तापमान और गिरने पर युवा अंकुरों को पाले से बचाएं।'
        : 'उच्च तापमान से पौधों पर तनाव हो सकता है। पर्याप्त सिंचाई और छाया सुनिश्चित करें।',
    };
    return { status: 'moderate', advice: advice[lang as keyof typeof advice] || advice.en };
  }
  
  if (tempOk && humidityIdeal) {
    const advice = {
      en: 'Excellent conditions for tea growth! Good time for plucking and routine maintenance.',
      as: 'চাহ বৃদ্ধিৰ বাবে উৎকৃষ্ট অৱস্থা! ছিঙা আৰু নিয়মীয়া ৰক্ষণাবেক্ষণৰ বাবে ভাল সময়।',
      hi: 'चाय की वृद्धि के लिए उत्कृष्ट स्थिति! तुड़ाई और नियमित रखरखाव के लिए अच्छा समय।',
    };
    return { status: 'good', advice: advice[lang as keyof typeof advice] || advice.en };
  }
  
  const advice = {
    en: 'Conditions are acceptable. Continue regular monitoring of your tea garden.',
    as: 'অৱস্থা গ্ৰহণযোগ্য। আপোনাৰ চাহ বাগিচাৰ নিয়মীয়া নিৰীক্ষণ চলাই যাওক।',
    hi: 'स्थिति स्वीकार्य है। अपने चाय बागान की नियमित निगरानी जारी रखें।',
  };
  return { status: 'moderate', advice: advice[lang as keyof typeof advice] || advice.en };
}

const weatherIcons = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
};

const statusIcons = {
  good: CheckCircle,
  moderate: AlertTriangle,
  bad: AlertTriangle,
};

const statusColors = {
  good: 'text-weather-good',
  moderate: 'text-weather-moderate',
  bad: 'text-weather-bad',
};

const statusBgColors = {
  good: 'bg-weather-good/10 border-weather-good/20',
  moderate: 'bg-weather-moderate/10 border-weather-moderate/20',
  bad: 'bg-weather-bad/10 border-weather-bad/20',
};

export function WeatherWidget() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [assessment, setAssessment] = useState<TeaWeatherAssessment | null>(null);

  useEffect(() => {
    const data = getSimulatedWeather();
    setWeather(data);
    setAssessment(assessTeaWeather(data, language));
  }, [language]);

  if (!weather || !assessment) return null;

  const WeatherIcon = weatherIcons[weather.icon];
  const StatusIcon = statusIcons[assessment.status];

  return (
    <div className="weather-card p-4 space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          {t('weather')}
        </h3>
        <div className="flex items-center gap-2">
          <WeatherIcon className="h-8 w-8 text-accent float" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-xl p-3 text-center hover-lift">
          <Thermometer className="h-5 w-5 mx-auto text-disease-rust mb-1" />
          <p className="text-xs text-muted-foreground">{t('temperature')}</p>
          <p className="font-bold text-lg">{weather.temperature}°C</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center hover-lift">
          <Droplets className="h-5 w-5 mx-auto text-accent mb-1" />
          <p className="text-xs text-muted-foreground">{t('humidity')}</p>
          <p className="font-bold text-lg">{weather.humidity}%</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center hover-lift">
          <Wind className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">{t('conditions')}</p>
          <p className="font-bold text-sm">{weather.conditions}</p>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${statusBgColors[assessment.status]} transition-all duration-300`}>
        <div className="flex items-start gap-3">
          <StatusIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${statusColors[assessment.status]}`} />
          <div className="space-y-1">
            <p className={`font-semibold text-sm ${statusColors[assessment.status]}`}>
              {t('teaAdvice')}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {assessment.advice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
