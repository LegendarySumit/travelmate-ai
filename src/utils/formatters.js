/**
 * Utility functions for formatting data
 */

/**
 * Format large numbers with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Format temperature
 * @param {number} temp - Temperature in Celsius
 * @param {string} unit - 'C' or 'F'
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (temp, unit = 'C') => {
  if (unit === 'F') {
    const fahrenheit = (temp * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

/**
 * Get weather emoji based on condition
 * @param {string} condition - Weather condition
 * @returns {string} Emoji
 */
export const getWeatherEmoji = (condition) => {
  const conditions = {
    clear: '☀️',
    sunny: '☀️',
    clouds: '☁️',
    cloudy: '☁️',
    rain: '🌧️',
    rainy: '🌧️',
    drizzle: '🌦️',
    snow: '❄️',
    snowy: '❄️',
    thunderstorm: '⛈️',
    mist: '🌫️',
    fog: '🌫️',
  };

  const key = condition?.toLowerCase() || '';
  for (const [keyword, emoji] of Object.entries(conditions)) {
    if (key.includes(keyword)) {
      return emoji;
    }
  }
  return '🌤️'; // Default
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
