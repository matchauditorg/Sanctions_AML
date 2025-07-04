/**
 * Purpose:
 * This page allows merchants to download previously screened customer reports
 * in CSV format. It fetches all screening results tied to the logged-in merchant.
 */

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { ScreeningResult } from '@/types/screening';
import { downloadCSV } from '@/lib/utils';

export default function ReportPage() {
  const [screeningData, setScreeningData] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch screening results on page load
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('screening_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching screening results:', error);
        setError('Could not fetch data.');
      } else {
        setScreeningData(data as ScreeningResult[]);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleExport = () => {
    downloadCSV(screeningData, 'screening_report.csv');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📥 Download Screening Reports</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && !error && screeningData.length > 0 && (
        <div className="mt-4">
          <Button onClick={handleExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>
      )}

      {!loading && screeningData.length === 0 && (
        <p className="text-gray-500">No screening data available for export.</p>
      )}
    </div>
  );
}
