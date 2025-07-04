'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ScreeningResult } from '@/types/screening';
import ScreeningResultTable from '@/components/ScreeningResultTable';

/**
 * Screening Results Page
 * 
 * Purpose:
 * This page fetches the authenticated merchant user's past screening results from Supabase
 * and displays them in a well-structured table.
 * 
 * Features:
 * - Fetch screening results filtered by the logged-in user's ID
 * - Show loading and error states to the user
 * - Display a friendly message if no results exist
 * - Use the reusable ScreeningResultTable component for UI consistency
 */
export default function ScreeningResultsPage() {
  // State to hold fetched screening results
  const [results, setResults] = useState<ScreeningResult[]>([]);

  // Loading state indicator while fetching data
  const [loading, setLoading] = useState<boolean>(true);

  // Error message state if fetching fails or user is unauthorized
  const [error, setError] = useState<string | null>(null);

  // Effect hook runs once on component mount to fetch data
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      setError(null);

      // Get the current logged-in user info from Supabase auth
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // Handle unauthorized access
      if (userError || !user) {
        setError('You must be logged in to view screening results.');
        setLoading(false);
        return;
      }

      // Fetch screening results for the current user, newest first
      const { data, error } = await supabase
        .from('screening_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Capture fetch error and show to user
        setError(
