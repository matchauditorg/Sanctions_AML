/**
 * Purpose:
 * - Fetch and display all screening results for the logged-in merchant.
 * - Show flagged hits, decisions, and other details in a table.
 */

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type ScreeningResult = {
  row: number;
  name: string;
  flagged: boolean;
  matched_sanction_list: boolean;
  high_risk_country: boolean;
  pep_match: boolean;
  match_probability: number;
  decision: string;
  reason_code: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ScreeningResultsPage() {
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      const { data, error } = await supabase
        .from('screening_results')
        .select('*')
        .order('row', { ascending: true });

      if (error) {
        setError('Failed to fetch screening results.');
        console.error(error);
      } else {
        setResults(data as ScreeningResult[]);
      }
      setLoading(false);
    }
    fetchResults();
  }, []);

  return (
    <div>
      <h1>Screening Results</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && results.length === 0 && <p>No screening results found.</p>}

      {!loading && results.length > 0 && (
        <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Row</th>
              <th>Name</th>
              <th>Sanction Hit</th>
              <th>High Risk Country</th>
              <th>PEP Match</th>
              <th>Probability (%)</th>
              <th>Decision</th>
              <th>Reason Code</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.row}>
                <td>{r.row}</td>
                <td>{r.name}</td>
                <td>{r.matched_sanction_list ? '✅' : '❌'}</td>
                <td>{r.high_risk_country ? '✅' : '❌'}</td>
                <td>{r.pep_match ? '✅' : '❌'}</td>
                <td>{r.match_probability.toFixed(1)}</td>
                <td>{r.decision}</td>
                <td>{r.reason_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
