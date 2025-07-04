'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Merchant Settings Page
 * 
 * Purpose:
 * Allows the authenticated merchant user to view and update their profile information,
 * such as company name, email, and contact details.
 * 
 * Features:
 * - Fetch and display merchant profile on page load
 * - Provide form inputs to update company name, email, and contact info
 * - Validate input fields
 * - Save updates to Supabase 'users' table
 * - Show success or error messages
 */

export default function SettingsPage() {
  // State for merchant profile form data
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Loading and status states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch merchant profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      // Get current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Unauthorized: Please login to access settings.');
        setLoading(false);
        return;
      }

      // Q
