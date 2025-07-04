// types/screening.ts

/**
 * Purpose:
 * Defines TypeScript interfaces and types for the screening logic and screening results.
 * Helps enforce consistent data shape and improve code reliability.
 */

/**
 * Represents a single row of customer data uploaded by the merchant for screening.
 */
export interface ScreeningInput {
  rowNumber: number;            // Row index from CSV, for tracking
  name: string;                 // Customer full name
  contactDetails: string;       // Phone or email contact info
  shippingAddress: string;      // Shipping address string
  billingAddress: string;       // Billing address string
  ipAddress: string;            // Customer's IP address
  isVPN: boolean;               // Flag if IP is detected as VPN
}

/**
 * Represents the result of screening a single customer record.
 */
export interface ScreeningResult {
  id: string;                   // Unique screening result ID (UUID)
  userId: string;               // Merchant user ID who uploaded the record
  rowNumber: number;            // Matches input row number
  name: string;
  contactDetails: string;
  shippingAddress: string;
  billingAddress: string;
  ipAddress: string;
  isVPN: boolean;
  matchedSanctionList: boolean; // True if matched any sanctions list
  highRiskCountry: boolean;     // True if IP or address in high-risk country
  pepMatch: boolean;            // True if matched Politically Exposed Person
  matchProbability: number;     // AI probability score (0-100) of match confidence
  decision: 'BLOCK' | 'ALLOW';  // Screening decision recommendation
  reasonCode: string;           // Code referencing reason for block/allow
  createdAt: string;            // ISO timestamp of screening
}
