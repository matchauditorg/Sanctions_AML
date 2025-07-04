// lib/geoip.ts

/**
 * Dummy function to resolve IP address to a country code.
 * In production, integrate with a real GeoIP service (like MaxMind or IPInfo).
 * @param ip - IP address string
 * @returns ISO country code, e.g. 'US', 'FR', 'IN'
 */
export async function getCountryFromIP(ip: string): Promise<string> {
  // Placeholder logic: replace with real API call
  if (ip.startsWith('192.168') || ip === '') {
    return 'Unknown';
  }
  // Example: Return US for demonstration
  return 'US';
}

/**
 * Check if the IP is from a VPN.
 * In practice, call an external VPN detection API or maintain a list of VPN IPs.
 * @param ip - IP address string
 * @param isVpnFlag - Flag from merchant indicating suspected VPN usage
 * @returns boolean indicating VPN usage
 */
export function isVPN(ip: string, isVpnFlag?: boolean): boolean {
  // If merchant provided flag, respect that for MVP
  if (typeof isVpnFlag === 'boolean') return isVpnFlag;

  // Otherwise, return false (no VPN detected)
  return false;
}
