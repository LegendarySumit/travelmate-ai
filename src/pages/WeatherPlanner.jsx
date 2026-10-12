// By Sandipta Mishra

import React, { useState, useEffect } from 'react';
import { 
  Search, Cloud, Sun, CloudRain, Droplets, Wind, Compass, 
  Sunrise, Sunset, Eye, Gauge, Umbrella, MapPin, Sparkles, 
  ArrowRight, Thermometer, ShieldCheck, Calendar, Clock, ChevronRight
} from 'lucide-react';
import { fetchWeatherData, fetchWeatherForecast } from '../services/api';
import { validateCountryInput } from '../utils/validation';

const POPULAR_CITIES = ['Tokyo', 'London', 'New York', 'Paris', 'Singapore', 'Dubai'];

const CITY_IMAGES = {
  'Tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800',
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'
};

export default function WeatherPlanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [citiesWeather, setCitiesWeather] = useState({});
  const [citiesLoading, setCitiesLoading] = useState(true);
  const mapRef = React.useRef(null);

  // Fetch weather for all popular cities on component mount
  useEffect(() => {
    const fetchAllCitiesWeather = async () => {
      setCitiesLoading(true);
      const weatherData = {};
      
      for (const city of POPULAR_CITIES) {
        try {
          const data = await fetchWeatherData(city);
          weatherData[city] = {
            temp: Math.round(data.main?.temp || 0),
            condition: data.weather?.[0]?.main || 'Unknown',
            icon: mapWeatherIcon(data.weather?.[0]?.main),
            image: CITY_IMAGES[city]
          };
        } catch (err) {
          console.warn(`Failed to fetch weather for ${city}:`, err.message);
          weatherData[city] = {
            temp: '—',
            condition: 'Unavailable',
            icon: 'cloud-sun',
            image: CITY_IMAGES[city]
          };
        }
      }
      
      setCitiesWeather(weatherData);
      setCitiesLoading(false);
    };

    fetchAllCitiesWeather();
  }, []);

  const handleSearch = async (cityName) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Validate input to prevent injection
      const validation = validateCountryInput(cityName, 50);
      if (!validation.valid) {
        setError(validation.error);
        setLoading(false);
        return;
      }

      // Fetch current weather AND forecast in parallel
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherData(validation.value),
        fetchWeatherForecast(validation.value)
      ]);

      // Transform OpenWeather API response to our format
      const enrichedWeather = {
        name: weatherData.name || cityName,
        country: weatherData.sys?.country || 'International',
        lat: weatherData.coord?.lat || 0,
        lon: weatherData.coord?.lon || 0,
        temp: Math.round(weatherData.main?.temp || 0),
        feelsLike: Math.round(weatherData.main?.feels_like || 0),
        condition: weatherData.weather?.[0]?.main || 'Unknown',
        icon: mapWeatherIcon(weatherData.weather?.[0]?.main),
        humidity: weatherData.main?.humidity || 0,
        wind: Math.round(weatherData.wind?.speed || 0),
        pressure: weatherData.main?.pressure || 0,
        uvIndex: 0, // OpenWeather free tier doesn't include UV index
        uvStatus: 'N/A',
        sunrise: new Date(weatherData.sys?.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(weatherData.sys?.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        visibility: Math.round((weatherData.visibility || 0) / 1000) + ' km',
        precipitation: (weatherData.rain?.['1h'] || 0).toFixed(1) + ' mm',
        aqi: 0, // Would require separate API call
        aqiStatus: 'N/A',
        chanceOfRain: Math.round((weatherData.clouds?.all || 0)) + '%',
        localTime: new Date().toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1600',
        packingTips: generatePackingTips(weatherData.main?.temp, weatherData.weather?.[0]?.main),
        // Transform forecast data
        forecast: (forecastData.forecast || []).map((day) => ({
          day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          date: day.date,
          tempMax: Math.round(day.tempMax),
          tempMin: Math.round(day.tempMin),
          condition: day.condition,
          icon: mapWeatherIcon(day.condition),
          humidity: day.humidity,
          windSpeed: Math.round(day.windSpeed)
        }))
      };

      setCurrentCity(enrichedWeather);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch weather data. Please try again.';
      console.error('❌ Error fetching weather:', errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Helper function to map OpenWeather icons to our icon names
  const mapWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return 'sun';
      case 'clouds':
        return 'cloud';
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return 'cloud-rain';
      default:
        return 'cloud-sun';
    }
  };

  // Generate packing tips based on weather
  const generatePackingTips = (temp, weatherCondition) => {
    const tips = [];
    const tempC = Math.round(temp || 0);

    if (tempC < 10) {
      tips.push('Pack warm winter coat and layers for cold weather');
      tips.push('Insulated gloves and warm hat recommended');
    } else if (tempC < 15) {
      tips.push('Bring light jacket or cardigan for cool weather');
      tips.push('Layered clothing will help you adjust to temperature changes');
    } else if (tempC > 25) {
      tips.push('Pack light, breathable clothing for hot weather');
      tips.push('High SPF sunscreen and sunglasses are essential');
    } else {
      tips.push('Pack comfortable layers for mild weather');
      tips.push('Light jacket for cooler evenings');
    }

    if (weatherCondition?.toLowerCase().includes('rain')) {
      tips.push('Waterproof jacket or compact umbrella required');
      tips.push('Waterproof bag for electronics');
    }

    if (weatherCondition?.toLowerCase() === 'clear') {
      tips.push('Perfect weather! Bring camera and enjoy outdoor activities');
    }

    return tips.slice(0, 5);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      setSearchQuery('');
    }
  };

  const renderWeatherIcon = (iconName, className = "w-6 h-6") => {
    switch (iconName) {
      case 'sun': return <Sun className={`${className} text-amber-500`} />;
      case 'cloud-rain': return <CloudRain className={`${className} text-blue-400`} />;
      case 'cloud': return <Cloud className={`${className} text-slate-400`} />;
      case 'cloud-sun':
      default:
        return <Cloud className={`${className} text-amber-400`} />;
    }
  };

  useEffect(() => {
    if (!mapRef.current || !currentCity) return;

    const bbox = `${currentCity.lon - 5},${currentCity.lat - 5},${currentCity.lon + 5},${currentCity.lat + 5}`;
    
    mapRef.current.innerHTML = `
      <iframe 
        src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${currentCity.lat},${currentCity.lon}&attribution=leaflet&locale=en"
        style="width: 100%; height: 100%; border: none; border-radius: 12px;"
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    `;
  }, [currentCity]);

  // Calculate SVG path coordinates for weather chart
  const generateChartPath = () => {
    if (!currentCity || !currentCity.forecast || currentCity.forecast.length === 0) {
      return { maxPath: "", minPath: "", points: [] };
    }

    const forecast = currentCity.forecast;
    const maxTemp = Math.max(...forecast.map(f => f.tempMax));
    const minTemp = Math.min(...forecast.map(f => f.tempMin));
    const tempRange = maxTemp - minTemp || 1;

    // SVG viewBox dimensions
    const viewWidth = 600;
    const chartHeight = 160;
    const padding = 40;
    const chartWidth = viewWidth - padding * 2;
    const pointSpacing = chartWidth / (forecast.length - 1 || 1);

    // Normalize temperatures to Y coordinates
    const tempToY = (temp) => {
      return 140 - ((temp - minTemp) / tempRange) * 120;
    };

    const points = forecast.map((day, idx) => ({
      x: padding + idx * pointSpacing,
      yMax: tempToY(day.tempMax),
      yMin: tempToY(day.tempMin),
    }));

    // Generate smooth curve path using quadratic Bezier
    const generatePath = (yAccessor) => {
      if (points.length === 0) return "";
      if (points.length === 1) {
        return `M ${points[0].x} ${yAccessor(points[0])}`;
      }

      let path = `M ${points[0].x} ${yAccessor(points[0])}`;
      for (let i = 1; i < points.length; i++) {
        const xMid = (points[i - 1].x + points[i].x) / 2;
        const yMid = (yAccessor(points[i - 1]) + yAccessor(points[i])) / 2;
        path += ` Q ${xMid} ${yMid} ${points[i].x} ${yAccessor(points[i])}`;
      }
      return path;
    };

    const maxPath = generatePath((p) => p.yMax);
    const minPath = generatePath((p) => p.yMin);

    return { maxPath, minPath, points };
  };

  const chartData = generateChartPath();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white pb-16">
      
      {/* HERO BANNER */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 px-4 sm:px-8 lg:px-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto z-10 flex flex-col items-center justify-center text-center">
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-blue-400 bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-800 mb-4 shadow-sm">
            Weather Planner
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 max-w-3xl">
            Know the weather, <br />
            <span className="text-blue-400">plan better.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-8">
            Get real-time weather updates, forecasts and AI-powered packing suggestions for your destination.
          </p>

          {/* Search Bar */}
          <form onSubmit={onSubmitSearch} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl shadow-xl max-w-3xl w-full">
            <div className="flex items-center pl-3 w-full sm:w-auto flex-grow text-slate-400">
              <Search className="w-5 h-5 mr-2 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city (e.g., Tokyo, New York, London, Paris)"
                className="w-full py-2 text-slate-800 placeholder-slate-400 focus:outline-none text-sm sm:text-base bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Get Weather</span>
              )}
            </button>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Popular cities:</span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleSearch(city)}
                disabled={loading}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-full border border-slate-700 transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20 space-y-8">

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Cloud className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No City Selected</h3>
            <p className="text-slate-600 max-w-md">
              Search for a city or click on a popular destination above to get started with real-time weather information and personalized packing suggestions.
            </p>
          </div>
        )}

        {!loading && hasSearched && currentCity && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Current Weather Card */}
              <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col justify-between p-6 sm:p-8 bg-white">
                <div className="absolute inset-0 z-0 opacity-5">
                  <img 
                    src={currentCity.heroImage} 
                    alt={currentCity.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm sm:text-base">
                      <MapPin className="w-4 h-4" />
                      <span>{currentCity.name}, {currentCity.country}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{currentCity.localTime}</p>
                  </div>
                </div>

                <div className="relative z-10 my-8 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      {renderWeatherIcon(currentCity.icon, "w-16 h-16")}
                    </div>
                    <div>
                      <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                        {currentCity.temp}°C
                      </div>
                      <p className="text-lg font-medium text-slate-600 mt-1">{currentCity.condition}</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs sm:text-sm text-slate-600">
                  <div>
                    <span className="text-slate-500 block">Feels like</span>
                    <span className="font-semibold text-slate-900">{currentCity.feelsLike}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Humidity</span>
                    <span className="font-semibold text-slate-900">{currentCity.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Wind</span>
                    <span className="font-semibold text-slate-900">{currentCity.wind} km/h</span>
                  </div>
                </div>
              </div>

              {/* Today's Highlights Grid */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Humidity Highlight */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center text-slate-600 text-sm font-medium">
                    <span>Humidity</span>
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="my-4">
                    <div className="text-3xl font-bold text-slate-900">{currentCity.humidity}%</div>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentCity.humidity > 70 ? 'Humid & moist air' : currentCity.humidity > 40 ? 'Comfortable levels' : 'Dry conditions'}
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${currentCity.humidity}%` }}></div>
                  </div>
                </div>

                {/* Wind Speed Highlight */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center text-slate-600 text-sm font-medium">
                    <span>Wind Speed</span>
                    <Wind className="w-5 h-5 text-teal-500" />
                  </div>
                  <div className="my-4">
                    <div className="text-3xl font-bold text-slate-900">{currentCity.wind} <span className="text-lg font-normal text-slate-500">km/h</span></div>
                    <p className="text-xs text-slate-500 mt-1">Light breeze across area</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-teal-600 font-medium">
                    <Compass className="w-4 h-4" /> Normal direction
                  </div>
                </div>

                {/* Pressure Highlight */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center text-slate-600 text-sm font-medium">
                    <span>Pressure</span>
                    <Gauge className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="my-4">
                    <div className="text-3xl font-bold text-slate-900">{currentCity.pressure} <span className="text-lg font-normal text-slate-500">hPa</span></div>
                    <p className="text-xs text-slate-500 mt-1">Stable atmospheric pressure</p>
                  </div>
                  <div className="text-xs text-slate-500">High pressure system</div>
                </div>

                {/* UV Index Highlight */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center text-slate-600 text-sm font-medium">
                    <span>UV Index</span>
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="my-4">
                    <div className="text-3xl font-bold text-slate-900">{currentCity.uvIndex} <span className="text-lg font-normal text-slate-500">({currentCity.uvStatus})</span></div>
                    <p className="text-xs text-slate-500 mt-1">Protection required during peak hours</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(currentCity.uvIndex / 12) * 100}%` }}></div>
                  </div>
                </div>

              </div>
            </div>

            {/* 7-DAY FORECAST */}
            <section className="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> 7-Day Forecast
                </h2>
                <button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                  View hourly forecast <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {currentCity.forecast.map((day, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition ${
                      idx === 0 
                        ? 'bg-blue-50 border-blue-300 shadow-sm' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{day.day}</p>
                      <p className="text-xs text-slate-500">{day.date}</p>
                    </div>

                    <div className="my-3 p-3 bg-white rounded-xl border border-slate-200">
                      {renderWeatherIcon(day.icon, "w-8 h-8")}
                    </div>

                    <div>
                      <div className="flex justify-center gap-2 text-sm font-bold text-slate-900">
                        <span>{day.tempMax}°</span>
                        <span className="text-slate-400">{day.tempMin}°</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 truncate">{day.condition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PACKING SUGGESTIONS & MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* AI Packing Suggestions */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">AI Packing Suggestions</h2>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                      Powered by AI
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-6">
                    Based on the current and upcoming weather in <span className="text-slate-900 font-semibold">{currentCity.name}</span>, here are some personalized packing suggestions:
                  </p>

                  <div className="space-y-3.5 mb-6">
                    {currentCity.packingTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold">
                          ✓
                        </div>
                        <p className="text-sm text-slate-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suitcase visual banner */}
                <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-200 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=1000" 
                    alt="Packed Suitcase" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent flex items-center px-6">
                    <div className="text-white">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Smart Travel Assistant</p>
                      <p className="text-sm font-semibold mt-0.5">Your packing list is optimized for {currentCity.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map Preview Card */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-600" /> Location Map
                  </h2>
                  <span className="text-xs text-slate-500">{currentCity.lat.toFixed(4)}° N, {currentCity.lon.toFixed(4)}° E</span>
                </div>

                <div 
                  ref={mapRef}
                  className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100"
                />

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-slate-500">Coordinates</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{currentCity.lat.toFixed(4)}° N, {currentCity.lon.toFixed(4)}° E</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-300">
                    {currentCity.name}, {currentCity.country}
                  </span>
                </div>
              </div>

            </div>

            {/* WEATHER OVERVIEW & OTHER DETAILS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Weather Overview Chart */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Weather Overview</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Temperature (°C) trend across 7 days</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> High
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Low
                    </span>
                  </div>
                </div>

                {/* Custom SVG Line Chart */}
                <div className="h-48 w-full relative pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                    {/* Background grid lines */}
                    <line x1="0" y1="20" x2="600" y2="20" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="0" y1="80" x2="600" y2="80" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="0" y1="140" x2="600" y2="140" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />

                    {/* High Temp Line path calculation simulation */}
                    {chartData.maxPath && (
                      <path 
                        d={chartData.maxPath}
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="3" 
                      />
                    )}
                    {/* Low Temp Line path */}
                    {chartData.minPath && (
                      <path 
                        d={chartData.minPath}
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                      />
                    )}

                    {/* Data points */}
                    {chartData.points.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.yMax} r="5" fill="#f59e0b" className="transition hover:scale-125" />
                        <circle cx={pt.x} cy={pt.yMin} r="5" fill="#3b82f6" className="transition hover:scale-125" />
                      </g>
                    ))}
                  </svg>

                  {/* Day Labels */}
                  <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
                    {currentCity.forecast.map((f, i) => (
                      <span key={i}>{f.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other Weather Details */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col justify-between">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Other Weather Details</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                      <Sunrise className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Sunrise</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{currentCity.sunrise}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                      <Sunset className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Sunset</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{currentCity.sunset}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-teal-100 text-teal-600 rounded-xl">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Visibility</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{currentCity.visibility}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                      <CloudRain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Precipitation</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{currentCity.precipitation}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Air Quality Index</p>
                      <p className="text-sm font-bold text-emerald-600 mt-0.5">{currentCity.aqi} ({currentCity.aqiStatus})</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                      <Umbrella className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Chance of Rain</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{currentCity.chanceOfRain}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* EXPLORE OTHER CITIES */}
            <section className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Explore Weather in Other Cities</h2>
                <button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {POPULAR_CITIES.map((city, idx) => {
                  const cityWeather = citiesWeather[city];
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleSearch(city)}
                      className="group relative rounded-3xl overflow-hidden shadow-md border border-slate-200 cursor-pointer h-64 flex flex-col justify-between p-5 transition transform hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={cityWeather?.image || CITY_IMAGES[city]} 
                          alt={city} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent"></div>
                      </div>

                      <div className="relative z-10 flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-bold text-white">{city}</h3>
                          <p className="text-xs text-slate-300">
                            {citiesLoading ? 'Loading...' : cityWeather?.condition || 'View weather'}
                          </p>
                        </div>
                        {cityWeather ? renderWeatherIcon(cityWeather.icon, 'w-6 h-6 text-amber-400') : <Cloud className="w-6 h-6 text-amber-400" />}
                      </div>

                      <div className="relative z-10 flex items-end justify-between">
                        <div>
                          <span className="text-2xl font-black text-white">
                            {citiesLoading ? '—' : `${cityWeather?.temp}°C`}
                          </span>
                          <p className="text-xs text-slate-300 mt-0.5">{citiesLoading ? 'Loading...' : 'Click to expand'}</p>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-blue-600 transition">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
