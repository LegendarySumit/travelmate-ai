/**
 * Validation utility functions
 */

/**
 * Validate country name input
 * @param {string} value - Country name
 * @returns {object} Validation result
 */
export const validateCountryName = (value) => {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'Please enter a country name' };
  }
  if (value.trim().length < 2) {
    return { valid: false, error: 'Country name must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s-]+$/.test(value)) {
    return { valid: false, error: 'Please enter a valid country name (letters only)' };
  }
  return { valid: true, error: null };
};

/**
 * Validate city name input
 * @param {string} value - City name
 * @returns {object} Validation result
 */
export const validateCityName = (value) => {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'Please enter a city name' };
  }
  if (value.trim().length < 2) {
    return { valid: false, error: 'City name must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s-]+$/.test(value)) {
    return { valid: false, error: 'Please enter a valid city name (letters only)' };
  }
  return { valid: true, error: null };
};

/**
 * Validate budget amount
 * @param {number} value - Budget amount
 * @returns {object} Validation result
 */
export const validateBudget = (value) => {
  if (!value || value === '') {
    return { valid: false, error: 'Please enter a budget amount' };
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid number' };
  }
  if (num <= 0) {
    return { valid: false, error: 'Budget must be greater than 0' };
  }
  if (num > 10000000) {
    return { valid: false, error: 'Budget amount seems too large' };
  }
  return { valid: true, error: null };
};

/**
 * Validate trip duration
 * @param {number} value - Duration in days
 * @returns {object} Validation result
 */
export const validateDuration = (value) => {
  if (!value || value === '') {
    return { valid: false, error: 'Please enter trip duration' };
  }
  const num = parseInt(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid number of days' };
  }
  if (num < 1) {
    return { valid: false, error: 'Duration must be at least 1 day' };
  }
  if (num > 365) {
    return { valid: false, error: 'Duration cannot exceed 365 days' };
  }
  return { valid: true, error: null };
};

/**
 * Validate currency code
 * @param {string} value - Currency code (USD, EUR, etc.)
 * @returns {object} Validation result
 */
export const validateCurrency = (value) => {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'Please select a currency' };
  }
  if (!/^[A-Z]{3}$/.test(value)) {
    return { valid: false, error: 'Invalid currency code format' };
  }
  return { valid: true, error: null };
};

/**
 * Validate email for feedback forms
 * @param {string} value - Email address
 * @returns {object} Validation result
 */
export const validateEmail = (value) => {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'Please enter an email address' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: null };
};

/**
 * Validate rating (1-5)
 * @param {number} value - Rating value
 * @returns {object} Validation result
 */
export const validateRating = (value) => {
  if (!value) {
    return { valid: false, error: 'Please select a rating' };
  }
  const num = parseInt(value);
  if (isNaN(num) || num < 1 || num > 5) {
    return { valid: false, error: 'Rating must be between 1 and 5' };
  }
  return { valid: true, error: null };
};
