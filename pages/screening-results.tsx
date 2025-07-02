// This is the page where you fetch and display all rows from the `screening_results` table in Supabase.
// It shows uploaded screening results in a simple HTML table.

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (uses environment variables)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the shape of each row in the screening_results table
type ScreeningResult = {
  row: number;
  name: string;
  flagged: boolean;
};

export default function ScreeningResultsPage() {
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the data when the component loads
  useEffect(() => {
    const fetchResults = async () => {
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
    };

    fetchResults();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Screening Results</h1>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && results.length === 0 && <p>No screening results found.</p>}

      {!loading && results.length > 0 && (
        <table border={1} cellPadding={10} style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Row</th>
              <th>Name</th>
              <th>Flagged</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.row}>
                <td>{result.row}</td>
                <td>{result.name}</td>
                <td>{result.flagged ? '✅ Yes' : '❌ No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
