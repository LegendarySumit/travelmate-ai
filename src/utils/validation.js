/**
 * Input Validation Utilities
 * Prevents prompt injection, XSS, and invalid data submission
 * Used by: DestinationExplorer, WeatherPlanner, BudgetPlanner
 */

/**
 * Validate country/city name input
 * @param {string} input - User input to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {Object} { valid: boolean, value: string, error: string }
 */
export const validateCountryInput = (input, maxLength = 50) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Please enter a valid country name' };
  }

  const cleaned = input.trim();

  if (cleaned.length === 0) {
    return { valid: false, error: 'Country name cannot be empty' };
  }

  if (cleaned.length > maxLength) {
    return {
      valid: false,
      error: `Country name cannot exceed ${maxLength} characters`,
    };
  }

  // Only allow alphanumeric, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z0-9\s\-']*$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Country name contains invalid characters',
    };
  }

  return { valid: true, value: cleaned };
};

/**
 * Validate city name input (alias for validateCountryInput)
 * @param {string} input - User input to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {Object} { valid: boolean, value: string, error: string }
 */
export const validateCityInput = (input, maxLength = 50) => {
  return validateCountryInput(input, maxLength);
};

/**
 * Validate currency code (ISO 4217 format)
 * @param {string} code - Currency code to validate (e.g., 'USD', 'EUR')
 * @returns {Object} { valid: boolean, value: string, error: string }
 */
export const validateCurrencyCode = (code) => {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Invalid currency code' };
  }

  const cleaned = code.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(cleaned)) {
    return { valid: false, error: 'Currency code must be 3 uppercase letters (e.g., USD)' };
  }

  return { valid: true, value: cleaned };
};

/**
 * Validate number input (e.g., for amounts, duration)
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, value: number, error: string }
 */
export const validateNumber = (value, options = {}) => {
  const {
    min = 0,
    max = Infinity,
    integer = false,
    allowNegative = false,
  } = options;

  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid number' };
  }

  if (integer && !Number.isInteger(num)) {
    return { valid: false, error: 'Please enter a whole number' };
  }

  if (!allowNegative && num < 0) {
    return { valid: false, error: 'Please enter a positive number' };
  }

  if (num < min) {
    return { valid: false, error: `Number must be at least ${min}` };
  }

  if (num > max) {
    return { valid: false, error: `Number cannot exceed ${max}` };
  }

  return { valid: true, value: num };
};
