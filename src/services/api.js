// API Service Layer
// Centralized functions for making API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * REST Countries API
 * https://restcountries.com/
 */
export const searchCountry = async (countryName) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Country not found. Please check the spelling and try again.');
      }
      throw new Error('Failed to fetch country data. Please try again later.');
    }

    const data = await response.json();
    return data[0]; // Return the first match
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * OpenWeather API
 * Note: Requires API key - should be called through backend proxy
 */
export const getWeather = async (city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/${encodeURIComponent(city)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      }
      throw new Error('Failed to fetch weather data. Please try again later.');
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to weather service. Backend may not be running.');
    }
    throw error;
  }
};

/**
 * Exchange Rate API
 * https://exchangerate-api.com/ (or similar)
 */
export const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates. Please try again later.');
    }

    const data = await response.json();
    return {
      rate: data.rates[toCurrency],
      date: data.date,
      base: data.base,
    };
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * AI Services - Groq API (through backend proxy)
 */
export const getDestinationSummary = async (countryName, countryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/destination-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ countryName, countryData }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI summary. Please try again.');
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to AI service. Backend may not be running.');
    }
    throw error;
  }
};

export const getWeatherAdvice = async (weatherData, city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/weather-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weatherData, city }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate weather advice. Please try again.');
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to AI service. Backend may not be running.');
    }
    throw error;
  }
};

export const getBudgetAdvice = async (budgetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/budget-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ budgetData }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate budget advice. Please try again.');
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to AI service. Backend may not be running.');
    }
    throw error;
  }
};
