/**
 * Formats a number into a string representing the Philippine Peso (PHP) currency.
 *
 * @param {number} number - The number to format.
 * @param {object} [options={}] - Optional configuration for the formatter.
 * @param {number} [options.minimumFractionDigits=2] - The minimum number of fraction digits to use.
 * @param {number} [options.maximumFractionDigits=2] - The maximum number of fraction digits to use.
 * @returns {string} The formatted currency string (e.g., "₱1,234.56").
 * @throws {Error} If the input is not a valid number.
 */
export const formatToPHP = (number, options = {}) => {
  // Validate that the input is a number
  if (typeof number !== 'number' || !isFinite(number)) {
    // For robustness, you could also return a default value like '₱0.00'
    throw new Error('Invalid input: The value to be formatted must be a finite number.');
  }

  // Default formatting options, can be overridden by the user
  const formatOptions = {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };

  // Create a formatter for the Philippine locale ('en-PH')
  // Using 'en-PH' ensures correct formatting conventions for the Philippines.
  const formatter = new Intl.NumberFormat('en-PH', formatOptions);

  return formatter.format(number);
};
