/**
 * Sanitizes a phone number string for use in a wa.me/<number> URL.
 *
 * Rules:
 *   - Strips all non-digit characters (+, spaces, dashes, parentheses)
 *   - If the result is 10 digits, prepends India country code "91"
 *   - Otherwise returns the digit-only string as-is (assumed to already include country code)
 *
 * Examples:
 *   sanitizeWaPhone('+91 98765 43210') → '919876543210'
 *   sanitizeWaPhone('919876543210')    → '919876543210'
 *   sanitizeWaPhone('9876543210')      → '919876543210'
 *   sanitizeWaPhone('')                → ''
 */
export function sanitizeWaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 ? `91${digits}` : digits;
}
