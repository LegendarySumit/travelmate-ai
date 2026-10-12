/**
 * Application constants - Actively used by TravelMate features
 */

// Supported currencies for budget planner - Used by Person C (BudgetPlanner)
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
];

// Popular cities for weather searches - Used by Person B (WeatherPlanner)
export const POPULAR_CITIES = [
  'London',
  'Paris',
  'Tokyo',
  'New York',
  'Sydney',
  'Dubai',
  'Singapore',
  'Barcelona',
  'Rome',
  'Mumbai',
  'Los Angeles',
  'Bangkok',
  'Istanbul',
  'Amsterdam',
  'Berlin',
];

// Budget categories - Used by Person C (BudgetPlanner)
export const BUDGET_CATEGORIES = [
  { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { id: 'food', label: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', label: 'Transportation', icon: '🚗' },
  { id: 'activities', label: 'Activities & Entertainment', icon: '🎭' },
];

// Weather condition mappings - Useful for formatting weather displays (Person B)
export const WEATHER_CONDITIONS = {
  clear: { emoji: '☀️', description: 'Clear skies' },
  clouds: { emoji: '☁️', description: 'Cloudy' },
  rain: { emoji: '🌧️', description: 'Rainy' },
  drizzle: { emoji: '🌦️', description: 'Light rain' },
  thunderstorm: { emoji: '⛈️', description: 'Thunderstorm' },
  snow: { emoji: '❄️', description: 'Snowy' },
  mist: { emoji: '🌫️', description: 'Misty' },
  fog: { emoji: '🌫️', description: 'Foggy' },
};

// Error messages - Use for consistent error handling across features
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  NOT_FOUND: 'Not found. Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  AI_FAILED: 'Failed to generate AI insights. Please try again.',
};
