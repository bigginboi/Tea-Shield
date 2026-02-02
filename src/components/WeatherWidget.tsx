import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle, MapPin, Loader2, CloudSnow, CloudFog, WifiOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNetwork } from '@/contexts/NetworkContext';

interface WeatherData {
  temperature: number;
  humidity: number;
  conditions: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'fog';
  windSpeed: number;
  locationName?: string;
  cached?: boolean;
}

interface TeaWeatherAssessment {
  status: 'good' | 'moderate' | 'bad';
  advice: string;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
}

const WEATHER_CACHE_KEY = 'tea-shield-weather-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getWeatherCondition(code: number): { conditions: string; icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'fog' } {
  if (code === 0) return { conditions: 'Clear Sky', icon: 'sun' };
  if (code <= 3) return { conditions: 'Partly Cloudy', icon: 'cloud' };
  if (code <= 49) return { conditions: 'Foggy', icon: 'fog' };
  if (code <= 59) return { conditions: 'Drizzle', icon: 'rain' };
  if (code <= 69) return { conditions: 'Rainy', icon: 'rain' };
  if (code <= 79) return { conditions: 'Snow', icon: 'snow' };
  if (code <= 99) return { conditions: 'Thunderstorm', icon: 'rain' };
  return { conditions: 'Cloudy', icon: 'cloud' };
}

function getCachedWeather(): WeatherData | null {
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return { ...data, cached: true };
      }
    }
  } catch {}
  return null;
}

function cacheWeather(data: WeatherData) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch {}
}

function getSimulatedWeather(): WeatherData {
  const hour = new Date().getHours();
  const month = new Date().getMonth();
  
  let baseTemp = 22;
  if (month >= 10 || month <= 2) baseTemp = 18;
  if (month >= 3 && month <= 5) baseTemp = 26;
  if (month >= 6 && month <= 9) baseTemp = 24;
  
  if (hour >= 6 && hour < 10) baseTemp -= 3;
  if (hour >= 10 && hour < 14) baseTemp += 4;
  if (hour >= 14 && hour < 18) baseTemp += 2;
  if (hour >= 18 || hour < 6) baseTemp -= 4;
  
  const temp = baseTemp + Math.floor(Math.random() * 4) - 2;
  
  let baseHumidity = 65;
  if (month >= 6 && month <= 9) baseHumidity = 80;
  if (month >= 10 || month <= 2) baseHumidity = 55;
  const humidity = Math.min(90, Math.max(45, baseHumidity + Math.floor(Math.random() * 15) - 7));
  
  return {
    temperature: temp,
    humidity,
    conditions: humidity > 75 ? 'Cloudy' : 'Partly Cloudy',
    icon: humidity > 75 ? 'cloud' : 'sun',
    windSpeed: 8 + Math.floor(Math.random() * 10),
    cached: false,
  };
}

async function fetchWeatherData(location: GeoLocation): Promise<WeatherData> {
  const { latitude, longitude } = location;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
  
  const response = await fetch(weatherUrl);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  
  const data = await response.json();
  const current = data.current;
  const { conditions, icon } = getWeatherCondition(current.weather_code);
  
  return {
    temperature: Math.round(current.temperature_2m),
    humidity: Math.round(current.relative_humidity_2m),
    conditions,
    icon,
    windSpeed: Math.round(current.wind_speed_10m),
  };
}

async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
    );
    const data = await response.json();
    return data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Your Location';
  } catch {
    return 'Your Location';
  }
}

function assessTeaWeather(weather: WeatherData, lang: string): TeaWeatherAssessment {
  const { temperature, humidity, conditions } = weather;
  
  const humidityRisk = humidity > 90;
  const isRainy = conditions.toLowerCase().includes('rain') || conditions.toLowerCase().includes('drizzle');
  
  if ((humidityRisk || isRainy) && temperature > 15 && temperature < 28) {
    const advice = {
      en: 'High humidity increases disease risk. Monitor for blister blight. Avoid plucking wet leaves.',
      as: 'উচ্চ আৰ্দ্ৰতাই ৰোগৰ আশংকা বঢ়ায়। ব্লিষ্টাৰ ব্লাইটৰ বাবে নিৰীক্ষণ কৰক। তিতা পাত ছিঙা এৰাই চলক।',
      hi: 'उच्च नमी से रोग का खतरा बढ़ता है। ब्लिस्टर ब्लाइट के लिए निगरानी करें। गीली पत्तियां तोड़ने से बचें।',
    };
    return { status: 'bad', advice: advice[lang as keyof typeof advice] || advice.en };
  }
  
  if (temperature < 15) {
    const advice = {
      en: 'Cool weather may slow growth. Protect young shoots from frost if temperature drops further.',
      as: 'শীতল বতৰে বৃদ্ধি লেহেম কৰিব পাৰে। তাপমাত্ৰা আৰু কমিলে কোমল কোঁহবোৰ তুষাৰৰ পৰা ৰক্ষা কৰক।',
      hi: 'ठंडे मौसम से विकास धीमा हो सकता है। तापमान और गिरने पर युवा अंकुरों को पाले से बचाएं।',
    };
    return { status: 'moderate', advice: advice[lang as keyof typeof advice] || advice.en };
  }
  
  if (temperature > 32) {
    const advice = {
      en: 'High temperature may stress plants. Ensure adequate irrigation and shade.',
      as: 'উচ্চ তাপমাত্ৰাই গছত চাপ পেলাব পাৰে। পৰ্যাপ্ত জলসিঞ্চন আৰু ছাঁ নিশ্চিত কৰক।',
      hi: 'उच्च तापमान से पौधों पर तनाव हो सकता है। पर्याप्त सिंचाई और छाया सुनिश्चित करें।',
    };
    return { status: 'moderate', advice: advice[lang as keyof typeof advice] || advice.en };
  }
  
  if (temperature >= 18 && temperature <= 30 && humidity >= 60 && humidity <= 85) {
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
  snow: CloudSnow,
  fog: CloudFog,
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

const uiLabels = {
  en: {
    weather: "Today's Weather",
    temperature: 'Temperature',
    humidity: 'Humidity',
    wind: 'Wind',
    teaAdvice: 'Tea Garden Advice',
    loading: 'Getting weather...',
    locationError: 'Location access needed',
    enableLocation: 'Enable Location',
    offlineMode: 'Offline Mode',
    offlineDesc: 'Using estimated weather data',
    cached: 'Cached data',
    simulated: 'Estimated',
  },
  as: {
    weather: 'আজিৰ বতৰ',
    temperature: 'তাপমাত্ৰা',
    humidity: 'আৰ্দ্ৰতা',
    wind: 'বতাহ',
    teaAdvice: 'চাহ বাগিচাৰ পৰামৰ্শ',
    loading: 'বতৰ পোৱা হৈছে...',
    locationError: 'অৱস্থান অনুমতি প্ৰয়োজন',
    enableLocation: 'অৱস্থান সক্ষম কৰক',
    offlineMode: 'অফলাইন মোড',
    offlineDesc: 'আনুমানিক বতৰৰ তথ্য ব্যৱহাৰ কৰা হৈছে',
    cached: 'কেছড ডাটা',
    simulated: 'আনুমানিক',
  },
  hi: {
    weather: 'आज का मौसम',
    temperature: 'तापमान',
    humidity: 'नमी',
    wind: 'हवा',
    teaAdvice: 'चाय बागान सलाह',
    loading: 'मौसम प्राप्त हो रहा है...',
    locationError: 'स्थान की अनुमति आवश्यक',
    enableLocation: 'स्थान सक्षम करें',
    offlineMode: 'ऑफ़लाइन मोड',
    offlineDesc: 'अनुमानित मौसम डेटा का उपयोग',
    cached: 'कैश्ड डेटा',
    simulated: 'अनुमानित',
  },
};

export function WeatherWidget() {
  const { language } = useLanguage();
  const { isOnline, mode } = useNetwork();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [assessment, setAssessment] = useState<TeaWeatherAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>('');

  const t = uiLabels[language] || uiLabels.en;

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      
      // If offline mode, use cached or simulated data
      if (!isOnline) {
        const cached = getCachedWeather();
        if (cached) {
          setWeather(cached);
          setLocationName(localStorage.getItem('tea-shield-location-name') || '');
          setAssessment(assessTeaWeather(cached, language));
        } else {
          const simulated = getSimulatedWeather();
          setWeather(simulated);
          setLocationName('');
          setAssessment(assessTeaWeather(simulated, language));
        }
        setLoading(false);
        return;
      }
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        });
        
        const { latitude, longitude } = position.coords;
        
        const [weatherData, locName] = await Promise.all([
          fetchWeatherData({ latitude, longitude }),
          getLocationName(latitude, longitude),
        ]);
        
        setWeather(weatherData);
        setLocationName(locName);
        setAssessment(assessTeaWeather(weatherData, language));
        
        // Cache the data
        cacheWeather(weatherData);
        localStorage.setItem('tea-shield-location-name', locName);
      } catch (err) {
        // Fallback to cached or simulated
        const cached = getCachedWeather();
        if (cached) {
          setWeather(cached);
          setLocationName(localStorage.getItem('tea-shield-location-name') || '');
          setAssessment(assessTeaWeather(cached, language));
        } else {
          const simulated = getSimulatedWeather();
          setWeather(simulated);
          setAssessment(assessTeaWeather(simulated, language));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [language, isOnline]);

  if (loading) {
    return (
      <div className="weather-card p-6 fade-in">
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!weather || !assessment) return null;

  const WeatherIcon = weatherIcons[weather.icon];
  const StatusIcon = statusIcons[assessment.status];
  const isOfflineData = !isOnline || weather.cached;

  return (
    <div className="weather-card p-4 space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            {t.weather}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {locationName && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {locationName}
              </p>
            )}
            {isOfflineData && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                <WifiOff className="h-2.5 w-2.5" />
                {weather.cached ? t.cached : t.simulated}
              </span>
            )}
          </div>
        </div>
        <WeatherIcon className="h-10 w-10 text-accent float" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-xl p-3 text-center hover-lift">
          <Thermometer className="h-5 w-5 mx-auto text-disease-rust mb-1" />
          <p className="text-xs text-muted-foreground">{t.temperature}</p>
          <p className="font-bold text-lg">{weather.temperature}°C</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center hover-lift">
          <Droplets className="h-5 w-5 mx-auto text-accent mb-1" />
          <p className="text-xs text-muted-foreground">{t.humidity}</p>
          <p className="font-bold text-lg">{weather.humidity}%</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center hover-lift">
          <Wind className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">{t.wind}</p>
          <p className="font-bold text-sm">{weather.windSpeed} km/h</p>
        </div>
      </div>

      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary text-sm font-medium text-foreground">
          {weather.conditions}
        </span>
      </div>

      <div className={`p-4 rounded-xl border ${statusBgColors[assessment.status]} transition-all duration-300`}>
        <div className="flex items-start gap-3">
          <StatusIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${statusColors[assessment.status]}`} />
          <div className="space-y-1">
            <p className={`font-semibold text-sm ${statusColors[assessment.status]}`}>
              {t.teaAdvice}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {assessment.advice}
            </p>
          </div>
        </div>
      </div>

      {!isOnline && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <WifiOff className="h-3 w-3" />
            {t.offlineDesc}
          </p>
        </div>
      )}
    </div>
  );
}
