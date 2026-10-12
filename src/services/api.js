/**
 * API Service Layer
 * Frontend calls backend proxy endpoints instead of external APIs directly
 * This ensures all sensitive API keys remain on backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch destination information from Groq AI via backend
 * @param {string} countryName - Name of the country to fetch info for
 * @returns {Promise<Object>} Country data with AI summaries
 */
export const fetchDestinationFromAI = async (countryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/destination`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ countryName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch destination data');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'AI request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching destination from AI:', error);
    throw error;
  }
};

/**
 * Fetch weather information from OpenWeather API via backend
 * @param {string} city - City name to fetch weather for
 * @returns {Promise<Object>} Weather data
 */
export const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch weather data');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Weather request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetch weather forecast from backend
 * @param {string} city - City name to fetch forecast for
 * @returns {Promise<Object>} Forecast data with 5-day predictions
 */
export const fetchWeatherForecast = async (city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/forecast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch forecast data');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Forecast request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

/**
 * Fetch exchange rates via backend
 * @param {string} fromCurrency - Source currency code (e.g., 'USD')
 * @param {string} toCurrency - Target currency code (e.g., 'EUR')
 * @returns {Promise<Object>} Exchange rate data
 */
export const fetchExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/exchange-rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fromCurrency, toCurrency }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch exchange rates');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Exchange rate request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};

/**
 * Fetch country-specific budget estimates from AI via backend
 * @param {string} destination - Destination country name
 * @param {string} currency - Currency code (e.g., 'INR', 'USD')
 * @returns {Promise<Object>} Budget estimates with accommodation, food, transport, activities, other
 */
export const fetchBudgetEstimates = async (destination, currency) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/budget/estimates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destination, currency }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch budget estimates');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Budget estimates request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching budget estimates:', error);
    throw error;
  }
};

/**
 * Health check - verify backend is running
 * @returns {Promise<boolean>} True if backend is healthy
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
