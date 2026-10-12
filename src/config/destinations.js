// By Sumit Kumar Prusty

/**
 * Destination Configuration
 * Maps countries/destinations to their primary currencies
 * Enables auto-currency selection when a destination is chosen
 */

export const COUNTRY_CURRENCY_MAP = {
  // Asia-Pacific
  'Japan': 'JPY',
  'Thailand': 'THB',
  'Singapore': 'SGD',
  'South Korea': 'KRW',
  'India': 'INR',
  'Indonesia': 'IDR',
  'Philippines': 'PHP',
  'Vietnam': 'VND',
  'Malaysia': 'MYR',
  'China': 'CNY',
  'Hong Kong': 'HKD',
  'Taiwan': 'TWD',
  'Bangladesh': 'BDT',
  'Pakistan': 'PKR',
  'Sri Lanka': 'LKR',
  'Australia': 'AUD',
  'New Zealand': 'NZD',

  // Europe
  'France': 'EUR',
  'Italy': 'EUR',
  'Germany': 'EUR',
  'Spain': 'EUR',
  'Netherlands': 'EUR',
  'Belgium': 'EUR',
  'Austria': 'EUR',
  'Greece': 'EUR',
  'Portugal': 'EUR',
  'Ireland': 'EUR',
  'Poland': 'PLN',
  'Czech Republic': 'CZK',
  'Hungary': 'HUF',
  'Sweden': 'SEK',
  'Norway': 'NOK',
  'Denmark': 'DKK',
  'Switzerland': 'CHF',
  'UK': 'GBP',
  'Turkey': 'TRY',

  // Americas
  'USA': 'USD',
  'Canada': 'CAD',
  'Mexico': 'MXN',
  'Brazil': 'BRL',
  'Argentina': 'ARS',
  'Chile': 'CLP',
  'Colombia': 'COP',
  'Peru': 'PEN',

  // Middle East & Africa
  'UAE': 'AED',
  'Saudi Arabia': 'SAR',
  'Israel': 'ILS',
  'Egypt': 'EGP',
  'South Africa': 'ZAR',
  'Nigeria': 'NGN',
  'Kenya': 'KES',
};

/**
 * Popular destinations for quick access
 * Ordered by popularity/demand
 */
export const POPULAR_DESTINATIONS = [
  { name: 'Japan', currency: 'JPY', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800' },
  { name: 'France', currency: 'EUR', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800' },
  { name: 'Italy', currency: 'EUR', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800' },
  { name: 'Thailand', currency: 'THB', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800' },
  { name: 'USA', currency: 'USD', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800' },
  { name: 'Singapore', currency: 'SGD', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800' },
  { name: 'UK', currency: 'GBP', image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=800' },
  { name: 'Canada', currency: 'CAD', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800' },
  { name: 'Mexico', currency: 'MXN', image: 'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?auto=format&fit=crop&q=80&w=800' },
  { name: 'Greece', currency: 'EUR', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800' },
  { name: 'New Zealand', currency: 'NZD', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800' },
];

/**
 * Get currency code for a destination
 * @param {string} destination - Destination name
 * @returns {string} Currency code or 'USD' as fallback
 */
export const getCurrencyForDestination = (destination) => {
  return COUNTRY_CURRENCY_MAP[destination] || 'USD';
};

/**
 * Get all destination names (sorted)
 * @returns {Array<string>} Array of destination names
 */
export const getAllDestinations = () => {
  return Object.keys(COUNTRY_CURRENCY_MAP).sort();
};
