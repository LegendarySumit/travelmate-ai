/**
 * Application constants
 */

// Supported currencies for budget planner
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

// Popular destinations for autocomplete suggestions
export const POPULAR_COUNTRIES = [
  'Japan',
  'France',
  'Italy',
  'Spain',
  'United States',
  'United Kingdom',
  'Germany',
  'Thailand',
  'India',
  'Australia',
  'Canada',
  'Brazil',
  'Mexico',
  'Greece',
  'Switzerland',
];

// Popular cities for weather searches
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

// Budget categories
export const BUDGET_CATEGORIES = [
  { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { id: 'food', label: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', label: 'Transportation', icon: '🚗' },
  { id: 'activities', label: 'Activities & Entertainment', icon: '🎭' },
];

// Feedback rating options
export const RATING_OPTIONS = [
  { value: 5, label: 'Excellent', emoji: '😍' },
  { value: 4, label: 'Good', emoji: '😊' },
  { value: 3, label: 'Average', emoji: '😐' },
  { value: 2, label: 'Poor', emoji: '😕' },
  { value: 1, label: 'Very Poor', emoji: '😞' },
];

// API endpoints (for backend integration)
export const API_ENDPOINTS = {
  // External APIs
  COUNTRIES: 'https://restcountries.com/v3.1',
  EXCHANGE_RATE: 'https://api.exchangerate-api.com/v4/latest',
  
  // Backend endpoints (when server is ready)
  WEATHER: '/api/weather',
  AI_DESTINATION: '/api/ai/destination-summary',
  AI_WEATHER: '/api/ai/weather-advice',
  AI_BUDGET: '/api/ai/budget-advice',
};

// Firebase collection names
export const FIREBASE_COLLECTIONS = {
  DESTINATIONS: 'saved_destinations',
  WEATHER_LOCATIONS: 'saved_weather_locations',
  BUDGETS: 'travel_budgets',
  FEEDBACK: 'user_feedback',
};

// Feature flags (for gradual rollout)
export const FEATURES = {
  AI_ENABLED: true,
  FIREBASE_ENABLED: false, // Enable after Firebase setup
  ANALYTICS_ENABLED: false, // Enable after GA setup
  USER_AUTH: false, // Enable if implementing authentication
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  NOT_FOUND: 'Not found. Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  AI_FAILED: 'Failed to generate AI insights. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Successfully saved!',
  DELETED: 'Successfully deleted!',
  UPDATED: 'Successfully updated!',
  FEEDBACK_SUBMITTED: 'Thank you for your feedback!',
};

// Local storage keys
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'travelmate_recent_searches',
  USER_PREFERENCES: 'travelmate_user_preferences',
  THEME: 'travelmate_theme',
};

// Weather condition mappings
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

// App metadata
export const APP_INFO = {
  NAME: 'TravelMate AI',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your smart travel companion for exploring destinations, checking weather, and planning budgets',
  GITHUB: 'https://github.com/yourusername/travelmate-ai',
  CONTACT_EMAIL: 'contact@travelmate.ai',
};
