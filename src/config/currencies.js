// By Sasanka Sekhar Malla

/**
 * Currency Configuration
 * Centralized list of supported currencies with codes and symbols
 * Reusable across all components
 */

export const CURRENCY_LIST = {
  "USD": { code: "US", symbol: "$", name: "US Dollar" },
  "EUR": { code: "EU", symbol: "€", name: "Euro" },
  "GBP": { code: "GB", symbol: "£", name: "British Pound" },
  "INR": { code: "IN", symbol: "₹", name: "Indian Rupee" },
  "AUD": { code: "AU", symbol: "A$", name: "Australian Dollar" },
  "CAD": { code: "CA", symbol: "C$", name: "Canadian Dollar" },
  "SGD": { code: "SG", symbol: "S$", name: "Singapore Dollar" },
  "CHF": { code: "CH", symbol: "CHF", name: "Swiss Franc" },
  "JPY": { code: "JP", symbol: "¥", name: "Japanese Yen" },
  "CNY": { code: "CN", symbol: "¥", name: "Chinese Yuan" },
  "NZD": { code: "NZ", symbol: "NZ$", name: "New Zealand Dollar" },
  "HKD": { code: "HK", symbol: "HK$", name: "Hong Kong Dollar" },
  "KRW": { code: "KR", symbol: "₩", name: "South Korean Won" },
  "BRL": { code: "BR", symbol: "R$", name: "Brazilian Real" },
  "MXN": { code: "MX", symbol: "Mex$", name: "Mexican Peso" },
  "THB": { code: "TH", symbol: "฿", name: "Thai Baht" },
  "IDR": { code: "ID", symbol: "Rp", name: "Indonesian Rupiah" },
  "SEK": { code: "SE", symbol: "kr", name: "Swedish Krona" },
  "NOK": { code: "NO", symbol: "kr", name: "Norwegian Krone" },
  "DKK": { code: "DK", symbol: "kr", name: "Danish Krone" },
  "AED": { code: "AE", symbol: "د.إ", name: "UAE Dirham" },
  "SAR": { code: "SA", symbol: "﷼", name: "Saudi Riyal" },
  "ZAR": { code: "ZA", symbol: "R", name: "South African Rand" },
  "ARS": { code: "AR", symbol: "$", name: "Argentine Peso" },
  "CLP": { code: "CL", symbol: "$", name: "Chilean Peso" },
  "COP": { code: "CO", symbol: "$", name: "Colombian Peso" },
  "PKR": { code: "PK", symbol: "₨", name: "Pakistani Rupee" },
  "BDT": { code: "BD", symbol: "৳", name: "Bangladeshi Taka" },
  "NGN": { code: "NG", symbol: "₦", name: "Nigerian Naira" },
  "EGP": { code: "EG", symbol: "£", name: "Egyptian Pound" },
  "ILS": { code: "IL", symbol: "₪", name: "Israeli Shekel" },
  "TRY": { code: "TR", symbol: "₺", name: "Turkish Lira" },
  "PLN": { code: "PL", symbol: "zł", name: "Polish Zloty" },
  "CZK": { code: "CZ", symbol: "Kč", name: "Czech Koruna" },
  "HUF": { code: "HU", symbol: "Ft", name: "Hungarian Forint" },
};

/**
 * Get currency info by code
 * @param {string} code - Currency code (e.g., 'USD')
 * @returns {Object|null} Currency info or null if not found
 */
export const getCurrencyInfo = (code) => {
  return CURRENCY_LIST[code] || null;
};

/**
 * Get all currency codes
 * @returns {Array<string>} Array of currency codes
 */
export const getCurrencyCodes = () => {
  return Object.keys(CURRENCY_LIST);
};

/**
 * Get all currencies as array (useful for dropdowns)
 * @returns {Array<Object>} Array of currency objects
 */
export const getCurrenciesAsArray = () => {
  return Object.entries(CURRENCY_LIST).map(([code, info]) => ({
    code,
    ...info,
  }));
};
