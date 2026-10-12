import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

//UTILITY FUNCTIONS

/**
 * Validate input to prevent prompt injection and security issues
 */
const validateInput = (input, maxLength = 100) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: must be a non-empty string');
  }

  const cleaned = input.trim();

  if (cleaned.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength}`);
  }

  // Allow alphanumeric, spaces, hyphens, apostrophes only
  if (!/^[a-zA-Z0-9\s\-']*$/.test(cleaned)) {
    throw new Error('Invalid characters in input');
  }

  if (cleaned.length === 0) {
    throw new Error('Input cannot be empty');
  }

  return cleaned;
};

/**
 * Exponential backoff with circuit breaker
 */
const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelayMs = 1000
) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delayMs = initialDelayMs * Math.pow(2, attempt);

      // Don't retry on 4xx errors (except 429)
      if (error.response?.status >= 400 && error.response?.status !== 429) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        console.log(`Retry attempt ${attempt + 1} after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
};

//API ENDPOINTS

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sumit Kumar Prusty: DESTINATION EXPLORER ENDPOINT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * POST /api/ai/destination
 * RESPONSIBILITY: Fetch destination information from Groq AI
 * 
 * Input: { countryName: "Italy" }
 * 
 * Output: {
 *   success: true,
 *   data: {
 *     name, region, capital, population, currency,
 *     description, aiSummary, culture, food,
 *     attractions[], aiTips[], recommendedCountries[],
 *     coordinates { lat, lng }
 *   }
 * }
 * 
 * Tasks:
 * - Validate country name input
 * - Call Groq AI with 3-model fallback
 * - Parse JSON response
 * - Handle errors and model switching
 * - Test with 10+ countries
 */

app.post('/api/ai/destination', async (req, res) => {
  try {
    const { countryName } = req.body;

    // Validate input
    const validatedCountry = validateInput(countryName, 50);

    const models = [
      process.env.PRIMARY_MODEL || 'qwen/qwen3.8-27b',
      process.env.SECONDARY_MODEL || 'openai/gpt-oss-120b',
      process.env.TERTIARY_MODEL || 'openai/gpt-oss-20b'
    ];

    let lastError = null;

    // Try each model with circuit breaker
    for (const model of models) {
      try {
        console.log(`[Sumit] Attempting model: ${model}`);

        const response = await retryWithBackoff(
          async () => {
            return axios.post(
              'https://api.groq.com/openai/v1/chat/completions',
              {
                model: model,
                messages: [
                  {
                    role: 'system',
                    content: `You are a travel research AI. Your ONLY job is to provide ACCURATE, SPECIFIC information about the requested country. 
CRITICAL RULES:
- ONLY provide data for ${validatedCountry}, NEVER mix with other countries
- Return ONLY valid JSON, no markdown, no extra text
- All fields MUST be specific to ${validatedCountry}
- Do NOT include generic or templated responses
- Verify facts before responding
`
                  },
                  {
                    role: 'user',
                    content: `Generate travel data for ${validatedCountry} ONLY. Return ONLY this JSON structure with NO other text:
{
  "name": "${validatedCountry}",
  "region": "Geographic region like Asia/Europe/Africa",
  "capital": "Capital city name",
  "population": "e.g. 38M",
  "currency": "CODE (Name) e.g. CAD (Canadian Dollar)",
  "language": "Primary languages",
  "area": "e.g. 9,985,000 km²",
  "timezone": "e.g. EST/CST/MST/PST",
  "callingCode": "+1",
  "description": "Write exactly 5-6 sentences about ${validatedCountry}'s geography and character",
  "aiSummary": "Write exactly 5-6 sentences about why tourists visit ${validatedCountry}",
  "culture": "2-3 sentences about ${validatedCountry}'s culture and traditions",
  "food": "2-3 sentences about ${validatedCountry}'s cuisine",
  "bestTimeToVisit": "2-3 sentences with specific months/seasons for ${validatedCountry}",
  "attractions": [
    {"title": "Attraction name", "subtitle": "Brief description"},
    {"title": "Attraction name", "subtitle": "Brief description"},
    {"title": "Attraction name", "subtitle": "Brief description"}
  ],
  "aiTips": [
    "Practical tip 1 for visiting ${validatedCountry}",
    "Practical tip 2 for visiting ${validatedCountry}",
    "Practical tip 3 for visiting ${validatedCountry}",
    "Practical tip 4 for visiting ${validatedCountry}"
  ],
  "recommendedCountries": [
    {"name": "Similar country 1", "region": "Region"},
    {"name": "Similar country 2", "region": "Region"},
    {"name": "Similar country 3", "region": "Region"},
    {"name": "Similar country 4", "region": "Region"},
    {"name": "Similar country 5", "region": "Region"},
    {"name": "Similar country 6", "region": "Region"}
  ],
  "coordinates": {"lat": latitude, "lng": longitude}
}`
                  }
                ],
                temperature: 0.3,
                max_tokens: 1300,
              },
              {
                headers: {
                  'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          },
          2,
          1000
        );

        let jsonStr = response.data.choices[0].message.content;
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            success: true,
            data: parsed,
            model: model,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        lastError = error;
        console.warn(`[PERSON A] Model ${model} failed:`, error.message);
        continue; // Try next model
      }
    }

    // All models failed
    return res.status(500).json({
      success: false,
      error: 'All AI models failed. Please try again later.',
      details: lastError?.message,
    });
  } catch (error) {
    console.error('[PERSON A] API Error:', error.message);
    return res.status(400).json({
      success: false,
      error: error.message || 'Invalid request',
    });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sandipta Mishra : WEATHER PLANNER ENDPOINTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * POST /api/weather
 * RESPONSIBILITY: Fetch current weather data from OpenWeather API
 * 
 * Input: { city: "London" }
 * 
 * Output: {
 *   success: true,
 *   data: {
 *     name, main { temp, feels_like, humidity, pressure },
 *     weather [{ main, description, icon }],
 *     wind { speed, deg },
 *     clouds { all }
 *   }
 * }
 * 
 * Tasks:
 * - Validate city name input
 * - Call OpenWeather current weather API
 * - Handle city not found errors
 * - Test with global cities
 */
app.post('/api/weather', async (req, res) => {
  try {
    const { city } = req.body;

    // Validate input
    const validatedCity = validateInput(city, 50);

    const response = await retryWithBackoff(
      async () => {
        console.log(`[PERSON B] Fetching weather for: ${validatedCity}`);
        return axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: validatedCity,
            appid: process.env.OPENWEATHER_API_KEY,
            units: 'metric',
          },
        });
      },
      2,
      1000
    );

    return res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[PERSON B] Weather API Error:', error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch weather data',
    });
  }
});

/**
 * POST /api/weather/forecast
 * RESPONSIBILITY: Fetch 7-day weather forecast from OpenWeather API
 * 
 * Input: { city: "London" }
 * 
 * Output: {
 *   success: true,
 *   data: {
 *     city, country,
 *     forecast: [
 *       { date, tempMax, tempMin, condition, icon, humidity, windSpeed },
 *       ... (7 days total, last 2 projected with averages)
 *     ]
 *   }
 * }
 * 
 * Key Task:
 * - Transform 5-day API data into 7-day forecast
 * - Calculate daily max/min from hourly data
 * - Project missing days (6-7) with averaged data
 * - Aggregate hourly forecasts into daily summaries
 */
app.post('/api/weather/forecast', async (req, res) => {
  try {
    const { city } = req.body;

    // Validate input
    const validatedCity = validateInput(city, 50);

    const response = await retryWithBackoff(
      async () => {
        console.log(`[PERSON B] Fetching forecast for: ${validatedCity}`);
        return axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            q: validatedCity,
            appid: process.env.OPENWEATHER_API_KEY,
            units: 'metric',
          },
        });
      },
      2,
      1000
    );

    // Transform forecast data to daily summaries (7-day)
    // OpenWeather API only provides 5 days, so we need to project 2 more days
    const dailyForecasts = {};
    const list = response.data.list || [];

    // Aggregate hourly data into daily data
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // YYYY-MM-DD
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          condition: item.weather?.[0]?.main || 'Unknown',
          icon: item.weather?.[0]?.main || 'Cloud',
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        };
      } else {
        // Keep track of max/min across the day
        dailyForecasts[date].tempMax = Math.max(dailyForecasts[date].tempMax, item.main.temp_max);
        dailyForecasts[date].tempMin = Math.min(dailyForecasts[date].tempMin, item.main.temp_min);
      }
    });

    const forecast = Object.values(dailyForecasts).slice(0, 5); // Get up to 5 days from API

    // If we have less than 7 days, add projected days to reach 7
    // Calculate averages from available days and use them for projection
    if (forecast.length < 7) {
      const avgTempMax = Math.round(forecast.reduce((sum, day) => sum + day.tempMax, 0) / forecast.length);
      const avgTempMin = Math.round(forecast.reduce((sum, day) => sum + day.tempMin, 0) / forecast.length);
      const avgHumidity = Math.round(forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length);
      const avgWindSpeed = Math.round(forecast.reduce((sum, day) => sum + day.windSpeed, 0) / forecast.length);

      // Add missing days to reach 7
      for (let i = forecast.length; i < 7; i++) {
        const lastDate = new Date(forecast[forecast.length - 1].date);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + (i - forecast.length + 1));
        const nextDateStr = nextDate.toISOString().split('T')[0];

        forecast.push({
          date: nextDateStr,
          tempMax: avgTempMax,
          tempMin: avgTempMin,
          condition: 'Partly Cloudy',
          icon: 'Clouds',
          humidity: avgHumidity,
          windSpeed: avgWindSpeed,
        });
      }
    }

    return res.json({
      success: true,
      data: {
        city: response.data.city.name,
        country: response.data.city.country,
        forecast: forecast,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[PERSON B] Forecast API Error:', error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch forecast data',
    });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sasanka Sekhar Malla : BUDGET PLANNER ENDPOINTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * POST /api/exchange-rate
 * RESPONSIBILITY: Fetch real-time exchange rates
 * 
 * Input: { fromCurrency: "USD", toCurrency: "INR" }
 * 
 * Output: {
 *   success: true,
 *   data: {
 *     fromCurrency: "USD",
 *     toCurrency: "INR",
 *     rate: 83.25,
 *     timestamp: "2024-01-15T10:30:00Z"
 *   }
 * }
 * 
 * Tasks:
 * - Validate ISO 4217 currency codes (3 letters)
 * - Call open.er-api.com API
 * - Check if currency pair exists
 * - Handle invalid currency codes
 */

app.post('/api/exchange-rate', async (req, res) => {
  try {
    const { fromCurrency, toCurrency } = req.body;

    // Validate inputs
    if (!fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        error: 'fromCurrency and toCurrency are required',
      });
    }

    // Validate currency codes (3 letter ISO codes)
    if (!/^[A-Z]{3}$/.test(fromCurrency) || !/^[A-Z]{3}$/.test(toCurrency)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid currency code format (must be 3 letters, e.g., USD, INR, EUR)',
      });
    }

    const response = await retryWithBackoff(
      async () => {
        console.log(`[PERSON C] Fetching exchange rate: ${fromCurrency} -> ${toCurrency}`);
        return axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      },
      2,
      1000
    );

    if (!response.data.rates[toCurrency]) {
      return res.status(400).json({
        success: false,
        error: `Exchange rate for ${toCurrency} not available`,
      });
    }

    return res.json({
      success: true,
      data: {
        fromCurrency,
        toCurrency,
        rate: response.data.rates[toCurrency],
        timestamp: response.data.time_last_update_utc,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[PERSON C] Exchange Rate API Error:', error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch exchange rates',
    });
  }
});

/**
 * POST /api/budget/estimates
 * RESPONSIBILITY: Get AI-powered, country-specific budget estimates
 * Uses Groq to analyze realistic costs for accommodation, food, transport, etc.
 * 
 * Input: { destination: "India", currency: "INR" }
 * 
 * Output: {
 *   success: true,
 *   data: {
 *     destination: "India",
 *     currency: "INR",
 *     estimates: {
 *       accommodation: { budget, midrange, luxury, notes },
 *       food: { budget, midrange, luxury, notes },
 *       transport: { budget, midrange, luxury, notes },
 *       activities: { budget, midrange, luxury, notes },
 *       other: { budget, midrange, luxury, notes }
 *     },
 *     totalDailyBudget, totalDailyMidrange, totalDailyLuxury,
 *     bestTimeToVisit,
 *     moneyTips: [...]
 *   }
 * }
 * 
 * Key Tasks:
 * - Validate destination and currency
 * - Create AI prompt that ensures COUNTRY-SPECIFIC costs
 * - Not generic prices - must analyze local cost of living
 * - Use 3-model fallback
 * - Parse JSON correctly
 * - Test with 20+ countries to ensure accuracy
 */
app.post('/api/budget/estimates', async (req, res) => {
  try {
    const { destination, currency } = req.body;

    if (!destination || !currency) {
      return res.status(400).json({
        success: false,
        error: 'destination and currency are required',
      });
    }

    const validatedDestination = validateInput(destination, 50);
    const validatedCurrency = validateInput(currency, 3);

    const models = [
      process.env.PRIMARY_MODEL || 'qwen/qwen3.8-27b',
      process.env.SECONDARY_MODEL || 'openai/gpt-oss-120b',
      process.env.TERTIARY_MODEL || 'openai/gpt-oss-20b'
    ];

    let lastError = null;

    for (const model of models) {
      try {
        console.log(`[PERSON C] Attempting budget estimates with model: ${model}`);

        const response = await retryWithBackoff(
          async () => {
            return axios.post(
              'https://api.groq.com/openai/v1/chat/completions',
              {
                model: model,
                messages: [
                  {
                    role: 'system',
                    content: `You are a travel cost analyst AI. Your job is to provide ACCURATE, REALISTIC daily budget estimates for tourists visiting specific countries.
CRITICAL RULES:
- ONLY provide realistic costs for ${validatedDestination}, NEVER generic estimates
- Return ONLY valid JSON, no markdown, no extra text
- Consider local cost of living for that specific country
- Provide estimates in ${validatedCurrency} currency
- Be realistic: luxury travelers vs budget travelers differ significantly
- Include all major expense categories
- Verify facts before responding
- Do NOT include generic prices, be country-specific`
                  },
                  {
                    role: 'user',
                    content: `Analyze realistic daily budget costs for a tourist visiting ${validatedDestination} in ${validatedCurrency}. Return ONLY this JSON with NO other text:
{
  "destination": "${validatedDestination}",
  "currency": "${validatedCurrency}",
  "estimates": {
    "accommodation": {
      "budget": <daily budget price per day in ${validatedCurrency}>,
      "midrange": <daily midrange price per day in ${validatedCurrency}>,
      "luxury": <daily luxury price per day in ${validatedCurrency}>,
      "notes": "Brief explanation of accommodation costs in ${validatedDestination}"
    },
    "food": {
      "budget": <budget meal price per day in ${validatedCurrency}>,
      "midrange": <midrange meal price per day in ${validatedCurrency}>,
      "luxury": <luxury meal price per day in ${validatedCurrency}>,
      "notes": "Brief explanation of food costs in ${validatedDestination}"
    },
    "transport": {
      "budget": <daily local transport per day in ${validatedCurrency}>,
      "midrange": <daily midrange transport per day in ${validatedCurrency}>,
      "luxury": <daily luxury transport per day in ${validatedCurrency}>,
      "notes": "Brief explanation of transport costs in ${validatedDestination}"
    },
    "activities": {
      "budget": <daily activities per day in ${validatedCurrency}>,
      "midrange": <daily midrange activities per day in ${validatedCurrency}>,
      "luxury": <daily luxury activities per day in ${validatedCurrency}>,
      "notes": "Brief explanation of activity costs in ${validatedDestination}"
    },
    "other": {
      "budget": <daily miscellaneous per day in ${validatedCurrency}>,
      "midrange": <daily midrange miscellaneous per day in ${validatedCurrency}>,
      "luxury": <daily luxury miscellaneous per day in ${validatedCurrency}>,
      "notes": "Brief explanation of other costs in ${validatedDestination}"
    }
  },
  "totalDailyBudget": <total daily budget category in ${validatedCurrency}>,
  "totalDailyMidrange": <total daily midrange category in ${validatedCurrency}>,
  "totalDailyLuxury": <total daily luxury category in ${validatedCurrency}>,
  "bestTimeToVisit": "Best time to visit for budget travelers in ${validatedDestination}",
  "moneyTips": [
    "Budget tip 1 for ${validatedDestination}",
    "Budget tip 2 for ${validatedDestination}",
    "Budget tip 3 for ${validatedDestination}"
  ]
}`
                  }
                ],
                temperature: 0.2,
                max_tokens: 1500,
              },
              {
                headers: {
                  'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          },
          2,
          1000
        );

        let jsonStr = response.data.choices[0].message.content;
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            success: true,
            data: parsed,
            model: model,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        lastError = error;
        console.warn(`[PERSON C] Model ${model} failed for budget estimates:`, error.message);
        continue;
      }
    }

    return res.status(500).json({
      success: false,
      error: 'All AI models failed to generate budget estimates. Please try again later.',
      details: lastError?.message,
    });
  } catch (error) {
    console.error('[PERSON C] Budget Estimates API Error:', error.message);
    return res.status(400).json({
      success: false,
      error: error.message || 'Invalid request',
    });
  }
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// START SERVER

app.listen(PORT, () => {
  console.log(`✅ TravelMate AI Backend running on http://localhost:${PORT}`);
  console.log(`📡 API Proxy ready for destination, weather, and exchange rate requests`);
  console.log(`🔒 All sensitive API keys stored securely on backend`);
});
