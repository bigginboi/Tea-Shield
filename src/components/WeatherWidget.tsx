import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Droplets, Wind, MapPin, Loader2, CloudSnow, CloudFog, WifiOff } from 'lucide-react';
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

interface ForecastDay {
  day: string;
  temp: number;
  rainChance: number;
  icon: 'sun' | 'cloud' | 'rain';
}

interface GeoLocation {
  latitude: number;
  longitude: number;
}

const WEATHER_CACHE_KEY = 'tea-shield-weather-cache';
const CACHE_DURATION = 30 * 60 * 1000;

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

function getCachedWeather(): { weather: WeatherData; forecast: ForecastDay[] } | null {
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      const { data, forecast, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return { weather: { ...data, cached: true }, forecast };
      }
    }
  } catch {}
  return null;
}

function cacheWeather(data: WeatherData, forecast: ForecastDay[]) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      data,
      forecast,
      timestamp: Date.now(),
    }));
  } catch {}
}

function getSimulatedWeather(): { weather: WeatherData; forecast: ForecastDay[] } {
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

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  
  return {
    weather: {
      temperature: temp,
      humidity,
      conditions: humidity > 75 ? 'Cloudy' : 'Partly Cloudy',
      icon: humidity > 75 ? 'cloud' : 'sun',
      windSpeed: 8 + Math.floor(Math.random() * 10),
      cached: false,
    },
    forecast: [
      { day: 'Today', temp: temp, rainChance: humidity > 70 ? 20 : 0, icon: humidity > 75 ? 'cloud' : 'sun' },
      { day: 'Tomorrow', temp: temp + 1, rainChance: 0, icon: 'cloud' },
      { day: days[(today + 2) % 7], temp: temp + 2, rainChance: 0, icon: 'sun' },
    ],
  };
}

async function fetchWeatherData(location: GeoLocation): Promise<{ weather: WeatherData; forecast: ForecastDay[] }> {
  const { latitude, longitude } = location;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,precipitation_probability_max,weather_code&timezone=auto&forecast_days=3`;
  
  const response = await fetch(weatherUrl);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  
  const data = await response.json();
  const current = data.current;
  const daily = data.daily;
  const { conditions, icon } = getWeatherCondition(current.weather_code);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  const forecast: ForecastDay[] = daily.time.map((date: string, i: number) => {
    const dayCode = daily.weather_code[i];
    let dayIcon: 'sun' | 'cloud' | 'rain' = 'sun';
    if (dayCode > 3 && dayCode <= 49) dayIcon = 'cloud';
    if (dayCode > 49) dayIcon = 'rain';
    
    return {
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[(today + i) % 7],
      temp: Math.round(daily.temperature_2m_max[i]),
      rainChance: daily.precipitation_probability_max[i] || 0,
      icon: dayIcon,
    };
  });
  
  return {
    weather: {
      temperature: Math.round(current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m),
      conditions,
      icon,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
    },
    forecast,
  };
}

async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
    );
    const data = await response.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
    const country = data.address?.country || '';
    return city && country ? `${city}, ${country}` : city || 'Your Location';
  } catch {
    return 'Your Location';
  }
}

const weatherIcons = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  fog: CloudFog,
};

const uiLabels = {
  en: { loading: 'Getting weather...' },
  as: { loading: 'বতৰ পোৱা হৈছে...' },
  hi: { loading: 'मौसम प्राप्त हो रहा है...' },
};

export function WeatherWidget() {
  const { language } = useLanguage();
  const { isOnline } = useNetwork();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>('');

  const t = uiLabels[language] || uiLabels.en;

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      
      if (!isOnline) {
        const cached = getCachedWeather();
        if (cached) {
          setWeather(cached.weather);
          setForecast(cached.forecast);
          setLocationName(localStorage.getItem('tea-shield-location-name') || '');
        } else {
          const simulated = getSimulatedWeather();
          setWeather(simulated.weather);
          setForecast(simulated.forecast);
          setLocationName('');
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
        
        const [weatherResult, locName] = await Promise.all([
          fetchWeatherData({ latitude, longitude }),
          getLocationName(latitude, longitude),
        ]);
        
        setWeather(weatherResult.weather);
        setForecast(weatherResult.forecast);
        setLocationName(locName);
        
        cacheWeather(weatherResult.weather, weatherResult.forecast);
        localStorage.setItem('tea-shield-location-name', locName);
      } catch {
        const cached = getCachedWeather();
        if (cached) {
          setWeather(cached.weather);
          setForecast(cached.forecast);
          setLocationName(localStorage.getItem('tea-shield-location-name') || '');
        } else {
          const simulated = getSimulatedWeather();
          setWeather(simulated.weather);
          setForecast(simulated.forecast);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [language, isOnline]);

  if (loading) {
    return (
      <div className="weather-gradient-card p-6 fade-in">
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <p className="text-sm text-white/80 font-medium">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const WeatherIcon = weatherIcons[weather.icon];
  const isOfflineData = !isOnline || weather.cached;

  return (
    <div className="weather-gradient-card p-5 space-y-4 fade-in">
      {/* Main Weather Display */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <WeatherIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-4xl font-bold text-white tracking-tight">{weather.temperature}°C</p>
            <p className="text-white/90 font-medium text-sm">{weather.conditions}</p>
          </div>
        </div>
        
        <div className="text-right space-y-1">
          <div className="flex items-center gap-1.5 justify-end text-white/90">
            <Droplets className="h-4 w-4" />
            <span className="text-sm font-semibold">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end text-white/90">
            <Wind className="h-4 w-4" />
            <span className="text-sm font-semibold">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2">
        {locationName && (
          <p className="text-xs text-white/80 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {locationName}
          </p>
        )}
        {isOfflineData && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/80 flex items-center gap-1">
            <WifiOff className="h-2.5 w-2.5" />
            {weather.cached ? 'Cached' : 'Estimated'}
          </span>
        )}
      </div>

      {/* 3-Day Forecast */}
      {forecast && forecast.length > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
          {forecast.map((day, i) => {
            const DayIcon = weatherIcons[day.icon] || Cloud;
            return (
              <div key={i} className="text-center py-2">
                <p className="text-xs text-white/70 font-medium mb-1">{day.day}</p>
                <p className="text-lg font-bold text-white">{day.temp}°</p>
                <div className="flex items-center justify-center gap-1 text-white/70 mt-1">
                  <span className="text-[10px]">{day.rainChance}%</span>
                  <DayIcon className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
