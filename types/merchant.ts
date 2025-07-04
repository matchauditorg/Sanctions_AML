// types/merchant.ts

/**
 * Purpose:
 * Defines TypeScript types for merchant user profiles and authentication.
 * Helps keep user-related data structured and consistent.
 */

/**
 * Merchant user information stored in database and used in app.
 */
export interface MerchantUser {
  id: string;                  // Unique user ID (UUID)
  email: string;               // User's login email
  companyName: string;         // Merchant company name
  createdAt: string;           // Account creation timestamp
  updatedAt?: string;          // Optional last profile update timestamp
}

/**
 * Optional profile settings for merchants (expandable for future use).
 */
export interface MerchantProfileSettings {
  emailNotificationsEnabled: boolean; // Flag for receiving email alerts
  preferredReportFormat: 'pdf' | 'csv' | 'xlsx'; // Preferred report download format
  timezone: string;                     // User's timezone string (e.g. "Europe/London")
}
