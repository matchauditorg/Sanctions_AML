// lib/validators.ts

/**
 * Simple regex to validate IPv4 addresses
 * @param ip - string IP address
 * @returns boolean indicating validity
 */
export function isValidIPv4(ip: string): boolean {
  const regex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  return regex.test(ip);
}

/**
 * Validate that required fields are present in a CSV row or input object
 * @param obj - input object representing one CSV row
 * @param requiredFields - array of field names to check
 * @returns array of missing fields, empty if none missing
 */
export function validateRequiredFields(obj: Record<string, any>, requiredFields: string[]): string[] {
  return requiredFields.filter(field => !obj[field] || obj[field].toString().trim() === '');
}
