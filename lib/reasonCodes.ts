// lib/reasonCodes.ts

/**
 * Lookup table for reason codes used in screening results.
 * Merchants can reference these codes to understand decisions.
 */
const reasonCodes: Record<string, string> = {
  R000: 'No risk detected',
  R001: 'Matched with a global sanctions list',
  R002: 'Person is a Politically Exposed Person (PEP)',
  R003: 'Customer located in high-risk country',
  R004: 'VPN detected for IP address',
  R005: 'Multiple risk factors combined',
};

export default reasonCodes;
