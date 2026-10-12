import React, { useState, useEffect, useRef } from 'react';
import koreaImage from '../assets/images/korea.png';
import taiwanImage from '../assets/images/taiwan.png';
import malyImage from '../assets/images/maly.png';

// Hardcoded fallback images that actually work
const hardcodedImages = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
];

const hardcodedHeroImages = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80",
];

// Get random hardcoded image
const getRandomImage = (images = hardcodedImages) => {
  return images[Math.floor(Math.random() * images.length)];
};


export default function DestinationExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [savedCountries, setSavedCountries] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const mapRef = useRef(null);
  const flagRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedDestinations');
    if (saved) {
      setSavedCountries(JSON.parse(saved));
    }
  }, []);

  // Placeholder state for when no country is selected
  const placeholderData = {
    name: "Select a Country",
    region: "—",
    capital: "—",
    population: "—",
    currency: "—",
    language: "—",
    area: "—",
    timezone: "—",
    callingCode: "—",
    countryCode: null,
    heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80",
    description: "Search for a country above to explore travel information, attractions, local cuisine, and personalized travel tips powered by AI.",
    aiSummary: "Start your journey by searching for a destination. Get comprehensive travel guides with cultural insights, dining recommendations, seasonal weather, and expert travel advice tailored to each country you explore.",
    culture: "Discover the unique cultural traditions, customs, and values of your chosen destination.",
    food: "Explore the local cuisine and dining experiences that define each destination.",
    bestTimeToVisit: "Learn about seasonal variations and the best times to visit your dream destination.",
    attractions: [
      { title: "Attractions", subtitle: "Coming soon", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80" },
      { title: "Places", subtitle: "Coming soon", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80" },
      { title: "Landmarks", subtitle: "Coming soon", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80" },
    ],
    aiTips: [
      "Search for a country to get personalized travel recommendations",
      "Save your favorite destinations for later reference",
      "Explore different regions to find your next adventure",
    ],
    recommendedCountries: [
      { name: "Japan", region: "Asia", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80" },
      { name: "France", region: "Europe", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80" },
      { name: "Italy", region: "Europe", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80" },
      { name: "Canada", region: "North America", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80" },
      { name: "Australia", region: "Oceania", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80" },
      { name: "Thailand", region: "Asia", image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&auto=format&fit=crop&q=80" },
    ],
    coordinates: { lat: 0, lng: 0 }
  };

  const [countryData, setCountryData] = useState(placeholderData);

  const popularPills = ['Japan', 'France', 'Italy', 'Canada', 'Australia', 'Switzerland'];

  const getCountryCode = async (countryName) => {
    // Manual mapping of common countries to their codes (avoids CORS issues)
    const countryCodeMap = {
      'japan': 'JP', 'france': 'FR', 'italy': 'IT', 'canada': 'CA', 'australia': 'AU', 'switzerland': 'CH',
      'united states': 'US', 'usa': 'US', 'america': 'US', 'uk': 'GB', 'united kingdom': 'GB', 'england': 'GB',
      'germany': 'DE', 'spain': 'ES', 'netherlands': 'NL', 'belgium': 'BE', 'austria': 'AT', 'greece': 'GR',
      'portugal': 'PT', 'ireland': 'IE', 'scotland': 'GB', 'wales': 'GB', 'norway': 'NO', 'sweden': 'SE',
      'denmark': 'DK', 'finland': 'FI', 'poland': 'PL', 'czechia': 'CZ', 'czech republic': 'CZ', 'hungary': 'HU',
      'romania': 'RO', 'bulgaria': 'BG', 'turkey': 'TR', 'russia': 'RU', 'ukraine': 'UA', 'mexico': 'MX',
      'brazil': 'BR', 'argentina': 'AR', 'chile': 'CL', 'peru': 'PE', 'colombia': 'CO', 'venezuela': 'VE',
      'south korea': 'KR', 'korea': 'KR', 'china': 'CN', 'thailand': 'TH', 'vietnam': 'VN', 'philippines': 'PH',
      'indonesia': 'ID', 'malaysia': 'MY', 'singapore': 'SG', 'taiwan': 'TW', 'india': 'IN', 'pakistan': 'PK',
      'bangladesh': 'BD', 'sri lanka': 'LK', 'saudi arabia': 'SA', 'uae': 'AE', 'united arab emirates': 'AE',
      'egypt': 'EG', 'south africa': 'ZA', 'nigeria': 'NG', 'kenya': 'KE', 'morocco': 'MA', 'tunisia': 'TN',
      'new zealand': 'NZ', 'thailand': 'TH', 'cambodia': 'KH', 'laos': 'LA', 'myanmar': 'MM', 'singapore': 'SG'
    };
    
    const code = countryCodeMap[countryName.toLowerCase()];
    if (code) {
      return code;
    }
    
    // Fallback: try REST Countries API, but handle CORS gracefully
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
      const data = await response.json();
      if (data && data[0] && data[0].cca2) {
        return data[0].cca2;
      }
      return null;
    } catch (error) {
      console.warn(`Could not fetch country code for ${countryName}, will use fallback flag`);
      return null;
    }
  };

  const fetchCountryFromGroq = async (countryName) => {
    setLoading(true);
    setError(null);
    
    // Get country code first (needed for flag)
    const countryCode = await getCountryCode(countryName);
    console.log(`Searching for: ${countryName}, Country Code: ${countryCode}`);
    
    // Array of models to try in order
    const models = [
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b'
    ];
    
    let lastError = null;
    
    // Try each model in sequence
    for (let modelIndex = 0; modelIndex < models.length; modelIndex++) {
      const currentModel = models[modelIndex];
      console.log(`Attempting to fetch with model: ${currentModel}`);
      
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              {
                role: 'system',
                content: 'You are a travel AI expert. Provide comprehensive, accurate travel and geographic data for countries in valid JSON format only. Always return valid JSON with no markdown formatting.'
              },
              {
                role: 'user',
                content: `Provide travel information for ${countryName}. Return ONLY valid JSON with these fields:
- description: 2-3 sentences about the country
- aiSummary: 2-3 sentences covering main attractions and travel appeal
- culture: 2-3 sentences about local customs and traditions
- food: 2-3 sentences about local cuisine and dining
- bestTimeToVisit: Write in paragraph format describing specific months/seasons relevant to this country (not generic "October to March"). Example: "The best time to visit [country] is during [specific season name and months] when [weather condition] and [activity/event]. Avoid [problematic season] due to [reason]."
- aiTips: Array of 4 tips (not 2-3), each 1-2 sentences with practical advice
- attractions: 3 attractions with title and subtitle
- recommendedCountries: 6 similar countries in the region
Return ONLY valid JSON (no markdown, no code blocks): {"name": "", "region": "", "capital": "", "population": "", "currency": "", "language": "", "area": "", "timezone": "", "callingCode": "", "description": "", "aiSummary": "", "culture": "", "food": "", "bestTimeToVisit": "", "attractions": [{"title": "", "subtitle": ""}, ...], "aiTips": ["tip 1", "tip 2", "tip 3", "tip 4"], "recommendedCountries": [{"name": "", "region": ""}], "coordinates": {"lat": 0, "lng": 0}}`
              }
            ],
            temperature: 0.7,
            max_tokens: 1800,
          })
        });

        // Check for rate limit errors (429)
        if (response.status === 429) {
          console.warn(`⚠️ Model ${currentModel} rate limited (429), switching to next model...`);
          lastError = new Error(`Model ${currentModel} rate limited`);
          continue; // Try next model
        }

        if (!response.ok) {
          const errorData = await response.json();
          console.warn(`❌ Model ${currentModel} error: ${errorData.error?.message}`);
          lastError = new Error(errorData.error?.message || `Model ${currentModel} error`);
          continue; // Try next model
        }

        const result = await response.json();
        
        if (!result.choices || !result.choices[0]) {
          console.warn(`Model ${currentModel} returned invalid response structure`);
          lastError = new Error('Invalid API response structure');
          continue; // Try next model
        }

        try {
          let jsonStr = result.choices[0].message.content;
          
          // Remove markdown code blocks if present
          jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
          
          // Find and extract JSON object
          const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.warn(`Model ${currentModel} did not return valid JSON`);
            lastError = new Error('No valid JSON in response');
            continue; // Try next model
          }
          
          const parsed = JSON.parse(jsonMatch[0]);

          // Generate flag URL using flagsapi.com (same as Japan)
          const flagUrl = countryCode ? `https://flagsapi.com/${countryCode}/flat/64.png` : `https://flagsapi.com/UN/flat/64.png`;

          // Validate and enrich data with HARDCODED images
          const enrichedData = {
            name: parsed.name || countryName,
            region: parsed.region || 'Asia',
            capital: parsed.capital || 'Unknown',
            population: parsed.population || 'Unknown',
            currency: parsed.currency || 'Unknown',
            language: parsed.language || 'Unknown',
            area: parsed.area || 'Unknown',
            timezone: parsed.timezone || 'Unknown',
            callingCode: parsed.callingCode || 'Unknown',
            description: parsed.description || 'No description available',
            aiSummary: parsed.aiSummary || 'No summary available',
            culture: parsed.culture || 'No culture information available',
            food: parsed.food || 'No food information available',
            bestTimeToVisit: parsed.bestTimeToVisit || 'Year-round destination',
            heroImage: getRandomImage(hardcodedHeroImages),
            flagEmoji: flagUrl,
            countryCode: countryCode,
            usedModel: currentModel,
            attractions: (parsed.attractions || []).map((attr) => ({
              title: attr.title || 'Attraction',
              subtitle: attr.subtitle || 'Popular Site',
              image: getRandomImage(hardcodedImages)
            })).slice(0, 3),
            aiTips: (parsed.aiTips || []).slice(0, 8),
            recommendedCountries: (parsed.recommendedCountries || []).map((rc) => ({
              name: rc.name || 'Country',
              region: rc.region || 'Region',
              image: getRandomImage(hardcodedImages)
            })).slice(0, 8),
            coordinates: parsed.coordinates || { lat: 0, lng: 0 }
          };

          console.log(`✅ Successfully fetched data using ${currentModel}`);
          setCountryData(enrichedData);
          const alreadySaved = savedCountries.some(c => c.name === enrichedData.name);
          setIsSaved(alreadySaved);
          setLoading(false);
          return; // Success! Exit the function
          
        } catch (parseError) {
          console.warn(`Model ${currentModel} parse error:`, parseError);
          lastError = parseError;
          continue; // Try next model
        }
      } catch (err) {
        console.warn(`Model ${currentModel} fetch error:`, err);
        lastError = err;
        continue; // Try next model
      }
    }
    
    // If we get here, all models failed
    const errorMessage = `Failed with all models. Last error: ${lastError?.message}`;
    console.error(`❌ ${errorMessage}`);
    setError(errorMessage);
    setLoading(false);
  };

  useEffect(() => {
    if (!mapRef.current || !countryData.coordinates) return;

    const bbox = `${countryData.coordinates.lng - 5},${countryData.coordinates.lat - 5},${countryData.coordinates.lng + 5},${countryData.coordinates.lat + 5}`;
    
    mapRef.current.innerHTML = `
      <iframe 
        src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${countryData.coordinates.lat},${countryData.coordinates.lng}&attribution=leaflet&locale=en"
        style="width: 100%; height: 100%; border: none; border-radius: 12px;"
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    `;
  }, [countryData.coordinates]);

  useEffect(() => {
    if (flagRef.current && countryData.countryCode) {
      flagRef.current.innerHTML = `
        <img 
          src="https://flagsapi.com/${countryData.countryCode}/flat/64.png" 
          alt="${countryData.name} flag" 
          style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover;"
          onerror="this.style.display='none'"
        />
      `;
    } else if (flagRef.current) {
      flagRef.current.innerHTML = '';
    }
  }, [countryData.countryCode, countryData.name]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setHasSearched(true);
      fetchCountryFromGroq(searchQuery);
    }
  };

  const handlePillClick = (country) => {
    setSearchQuery(country);
    setHasSearched(true);
    fetchCountryFromGroq(country);
  };

  const toggleSaveCurrent = () => {
    if (isSaved) {
      const updated = savedCountries.filter(c => c.name !== countryData.name);
      setSavedCountries(updated);
      localStorage.setItem('savedDestinations', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      const newSaved = {
        name: countryData.name,
        region: countryData.region,
        savedDate: new Date().toLocaleDateString(),
        image: countryData.heroImage
      };
      const updated = [newSaved, ...savedCountries];
      setSavedCountries(updated);
      localStorage.setItem('savedDestinations', JSON.stringify(updated));
      setIsSaved(true);
    }
  };

  const deleteFromSaved = (countryName) => {
    const updated = savedCountries.filter(c => c.name !== countryName);
    setSavedCountries(updated);
    localStorage.setItem('savedDestinations', JSON.stringify(updated));
    if (countryData.name === countryName) {
      setIsSaved(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-20">
      
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
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-800 mb-4 shadow-sm">
            Destination Explorer
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 max-w-3xl">
            Explore the world, <br />
            <span className="text-emerald-400">one destination at a time.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-8">
            Discover detailed information about countries with AI-powered Groq API integration.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl shadow-xl max-w-3xl w-full">
            <div className="flex items-center pl-3 w-full sm:w-auto flex-grow text-slate-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a country..."
                className="w-full py-2 text-slate-800 placeholder-slate-400 focus:outline-none text-sm sm:text-base bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Search</span>
              )}
            </button>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Popular searches:</span>
            {popularPills.map((pill) => (
              <button
                key={pill}
                onClick={() => handlePillClick(pill)}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-full border border-slate-700 transition-all"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 font-medium animate-pulse">AI is exploring {searchQuery}...</p>
          </div>
        ) : (
          <>
            {/* TOP COUNTRY CARD & MAP SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
              
              {/* Left Photo Card */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-4 shadow-sm border border-slate-200 relative group overflow-hidden">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden mb-2">
                  <img 
                    src={countryData.heroImage} 
                    alt={countryData.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    onClick={toggleSaveCurrent}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                      isSaved ? 'bg-emerald-600 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                    }`}
                    title={isSaved ? "Saved to favorites" : "Save destination"}
                  >
                    <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Country Info & Flag Card */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center space-x-3">
                      {/* Flag Display - Replaces Text Code */}
                      <div ref={flagRef} className="flex items-center justify-center" />
                      <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">{countryData.name}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{countryData.region}</span>
                          <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{countryData.capital}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                    {countryData.description}
                  </p>

                  {/* Quick stats grid - CENTERED */}
                  <div className="flex flex-col items-center py-2 border-t border-b border-slate-100">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <div className="text-[11px] text-slate-400 uppercase font-bold">Capital</div>
                        <div className="text-xs font-bold text-slate-800">{countryData.capital}</div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                        <div className="text-[11px] text-slate-400 uppercase font-bold">Population</div>
                        <div className="text-xs font-bold text-slate-800">{countryData.population}</div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div className="text-[11px] text-slate-400 uppercase font-bold">Currency</div>
                        <div className="text-xs font-bold text-slate-800">{countryData.currency}</div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                        </div>
                        <div className="text-[11px] text-slate-400 uppercase font-bold">Language</div>
                        <div className="text-xs font-bold text-slate-800">{countryData.language}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL MAP SECTION */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Location Map</h3>
              <div 
                ref={mapRef}
                className="w-full h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
              />
            </div>

            {/* TABS NAVIGATION */}
            <div className="flex items-center space-x-2 border-b border-slate-200 mb-8 overflow-x-auto">
              {['Overview', 'Attractions', 'Culture', 'Food', 'Best Time to Visit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 sm:p-8 shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">About {countryData.name}</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-slate-700 text-base leading-relaxed">
                      {countryData.description}
                    </p>
                    <p className="text-slate-700 text-base leading-relaxed">
                      The country's unique geography, consisting of four main islands—Honshu, Hokkaido, Kyushu, and Shikoku—contributes to its diverse landscapes and regional cultures. From the tropical beaches of Okinawa to the snowy mountains of Hokkaido, Japan offers varied experiences throughout its territories. Its efficient transportation network makes it easy to explore different regions, making it ideal for both short visits and extended stays.
                    </p>
                  </div>
                </div>

                {/* AI Travel Summary Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">AI Travel Summary</h3>
                  </div>
                  <p className="text-slate-700 text-base leading-relaxed bg-white/60 rounded-2xl p-4">
                    {countryData.aiSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Best Time to Visit */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 sm:p-8 shadow-md border border-orange-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Best Time to Visit</h3>
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed mb-4 bg-white/60 rounded-2xl p-3">
                      {countryData.bestTimeToVisit}
                    </p>
                  </div>

                  {/* Travel Tips */}
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-6 sm:p-8 shadow-md border border-rose-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Travel Tips & Advice</h3>
                    </div>
                    <div className="space-y-2">
                      {countryData.aiTips?.map((tip, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-colors">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white flex-shrink-0 text-xs font-bold">✓</span>
                          <span className="text-slate-700 text-sm leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Top Attractions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {countryData.attractions?.slice(0, 3).map((attr, index) => (
                      <div key={index} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={attr.image} 
                            alt={attr.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 text-base mb-1">{attr.title}</h4>
                          <p className="text-xs text-slate-500 font-medium">{attr.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ATTRACTIONS */}
            {activeTab === 'Attractions' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">All Attractions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {countryData.attractions?.map((attr, index) => (
                    <div key={index} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                      <div className="h-60 overflow-hidden relative">
                        <img src={attr.image} alt={attr.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-slate-900 text-xl mb-1">{attr.title}</h4>
                        <p className="text-sm text-slate-500">{attr.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CULTURE */}
            {activeTab === 'Culture' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Culture & Heritage</h3>
                <p className="text-slate-700 text-base leading-relaxed">
                  {countryData.culture}
                </p>
              </div>
            )}

            {/* TAB CONTENT: FOOD */}
            {activeTab === 'Food' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Gastronomy Guide</h3>
                <p className="text-slate-700 text-base leading-relaxed">
                  {countryData.food}
                </p>
              </div>
            )}

            {/* TAB CONTENT: BEST TIME TO VISIT */}
            {activeTab === 'Best Time to Visit' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Seasonal Guide</h3>
                <p className="text-slate-700 text-base leading-relaxed">
                  {countryData.bestTimeToVisit}
                </p>
              </div>
            )}

            {/* YOU MIGHT ALSO LIKE */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">You Might Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {countryData.recommendedCountries?.map((rec, index) => (
                  <div 
                    key={index} 
                    onClick={() => handlePillClick(rec.name)}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="h-32 overflow-hidden relative">
                      <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm mb-0.5">{rec.name}</h4>
                      <p className="text-[11px] text-slate-500">{rec.region}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVED DESTINATIONS - DYNAMIC */}
            <div className="mt-12 mx-auto max-w-4xl bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 shadow-md border border-indigo-200">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-1.5">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  <h3 className="text-lg font-bold text-slate-900">Your Saved Destinations</h3>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-white px-2.5 py-0.5 rounded-full ml-3">{savedCountries.length} saved</span>
              </div>

              {savedCountries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center">
                  {savedCountries.map((saved, idx) => (
                    <div key={idx} className="group relative w-full">
                      <div 
                        onClick={() => handlePillClick(saved.name)} 
                        className="flex items-center space-x-2 p-2 rounded-xl bg-white/80 border border-indigo-200 hover:bg-white hover:shadow-md transition-all cursor-pointer h-full"
                      >
                        <img src={saved.image} alt={saved.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs">{saved.name}</h4>
                          <div className="text-[10px] text-slate-500">Saved {saved.savedDate}</div>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFromSaved(saved.name);
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete saved destination"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">No Saved Destinations Yet</h4>
                  <p className="text-slate-600 text-center text-xs max-w-sm">
                    Save your favorites by clicking the heart icon to access them here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
