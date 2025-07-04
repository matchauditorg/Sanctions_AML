/**
 * Purpose:
 * This component provides a form to upload a CSV file containing screening results.
 * It parses the CSV file on the client side,
 * validates the data structure,
 * and inserts each row into the Supabase `screening_results` table.
 * Users receive feedback on upload progress, errors, or success.
 */

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the expected CSV row structure for type safety
type ScreeningResultCSVRow = {
  row: string;      // We'll parse to number before inserting
  name: string;
  flagged: string;  // We'll parse to boolean before inserting
};

// Helper function to parse CSV text into an array of objects
function parseCSV(csvText: string): ScreeningResultCSVRow[] {
  // Split the text into lines
  const lines = csvText.trim().split('\n');

  // Extract headers and rows
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1);

  // Map rows to objects keyed by headers
  return rows.map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
}

export default function ScreeningUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Handle file input change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle CSV upload
  const onUpload = async () => {
    if (!file) {
      setMessage('Please select a CSV file first.');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Read file text
      const text = await file.text();

      // Parse CSV
      const parsedRows = parseCSV(text);

      // Validate parsed data
      const validRows = parsedRows.filter(
        row =>
          row.row &&
          !isNaN(Number(row.row)) &&
          row.name &&
          (row.flagged.toLowerCase() === 'true' || row.flagged.toLowerCase() === 'false')
      );

      if (validRows.length === 0) {
        setMessage('No valid rows found in the CSV.');
        setUploading(false);
        return;
      }

      // Prepare data for Supabase insertion with correct types
      const dataToInsert = validRows.map(row => ({
        row: Number(row.row),
        name: row.name,
        flagged: row.flagged.toLowerCase() === 'true',
      }));

      // Insert into Supabase (up to 100 rows per insert)
      // Supabase limits bulk inserts, so you might want to chunk data in bigger uploads
      const { error } = await supabase.from('screening_results').insert(dataToInsert);

      if (error) {
        console.error('Insert error:', error);
        setMessage(`Upload failed: ${error.message}`);
      } else {
        setMessage(`Successfully uploaded ${dataToInsert.length} rows.`);
        setFile(null);
        (document.getElementById('csv-file-input') as HTMLInputElement).value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('An unexpected error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Screening Results CSV</h1>
      <input
        type="file"
        id="csv-file-input"
        accept=".csv,text/csv"
        onChange={onFileChange}
        disabled={uploading}
      />
      <br />
      <button onClick={onUpload} disabled={uploading || !file} style={{ marginTop: '1rem' }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Successfully') ? 'green' : 'red' }}>{message}</p>}
      <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
        CSV format: <code>row,name,flagged</code> where <code>flagged</code> is "true" or "false".
      </p>
    </div>
  );
}
