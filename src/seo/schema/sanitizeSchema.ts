/**
 * Recursively removes properties that are undefined, null, empty strings, or empty arrays.
 * Prevents invalid or empty JSON-LD properties.
 */
export function sanitizeSchema<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      const cleanArray = value
        .map(item => (typeof item === 'object' && item !== null && !Array.isArray(item) ? sanitizeSchema(item) : item))
        .filter(item => item !== undefined && item !== null && item !== '');
      if (cleanArray.length > 0) {
        cleaned[key] = cleanArray;
      }
    } else if (typeof value === 'object' && value.constructor === Object) {
      const cleanSub = sanitizeSchema(value);
      if (Object.keys(cleanSub).length > 0) {
        cleaned[key] = cleanSub;
      }
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned as T;
}
