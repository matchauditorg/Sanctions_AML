/**
 * UploadPage Component
 *
 * 🌟 PURPOSE:
 * - Allow user to upload a CSV file of screening data.
 * - Parse CSV to JSON with columns: row, name, flagged.
 * - Send JSON data + filename to backend API `/api/screening`.
 * - Show loading, success, or error messages.
 * - Display a summary of total records and flagged (Likely High Risk) count.
 * - Show detailed table with AI risk labels and confidence scores.
 */

import React, { useState } from 'react';

// For CSV parsing
import Papa from 'papaparse';

// Define the structure of each screening row expected from CSV and backend
type ScreeningInput = {
  row: number;
  name: string;
  flagged: boolean;
};

type ScreeningResult = ScreeningInput & {
  risk_label: string;
  confidence_score: number;
};

export default function UploadPage() {
  // State variables
  const [fileName, setFileName] = useState<string | null>(null);
  const [data, setData] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Handle file selection
   * @param e File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);
    setData([]);

    if (!e.target.files || e.target.files.length === 0) {
      setError('No file selected');
      return;
    }

    const file = e.target.files[0];
    setFileName(file.name);

    // Parse CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Validate required columns
        const parsedData = results.data as any[];

        if (
          !parsedData.every(
            (row) =>
              'row' in row &&
              'name' in row &&
              'flagged' in row
          )
        ) {
          setError('CSV must include columns: row, name, flagged');
          return;
        }

        // Convert to proper types
        try {
          const formattedData: ScreeningInput[] = parsedData.map((row) => ({
            row: Number(row.row),
            name: String(row.name).trim(),
            flagged: row.flagged.toLowerCase() === 'true' || row.flagged === '1',
          }));

          setData(formattedData);
        } catch (err) {
          setError('Failed to parse CSV data correctly.');
        }
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
      },
    });
  };

  /**
   * Send parsed screening data to backend API for screening + AI risk analysis
   */
  const handleUpload = async () => {
    if (!data.length) {
      setError('No data to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, filename: fileName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unknown error');
      }

      // After success, update results to display risk labels from backend response
      // Note: This example assumes backend saved all records; we keep local copy here.
      // For real-world, you might fetch updated results from DB after upload.
      // Here, we just show the uploaded data with risk labels null (replace with your logic if needed).
      setSuccessMessage(result.message);
      setData((prev) =>
        prev.map((row) => ({
          ...row,
          risk_label: 'Processed', // Placeholder, ideally update from DB fetch
          confidence_score: 0,
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to upload data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Upload Screening CSV</h1>

      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        disabled={loading}
      />

      {fileName && <p>Selected file: <b>{fileName}</b></p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p>Parsed {data.length} records ready for upload.</p>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload & Screen'}
          </button>
        </div>
      )}

      {successMessage && (
        <p style={{ color: 'green', marginTop: '1rem' }}>
          {successMessage}
        </p>
      )}

      {/* Show uploaded data + (mock) risk labels */}
      {data.length > 0 && (
        <table
          style={{
            marginTop: '2rem',
            borderCollapse: 'collapse',
            width: '100%',
          }}
          border={1}
          cellPadding={8}
        >
          <thead>
            <tr>
              <th>Row</th>
              <th>Name</th>
              <th>Flagged (Original)</th>
              <th>Risk Label (AI)</th>
              <th>Confidence Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.row}>
                <td>{row.row}</td>
                <td>{row.name}</td>
                <td>{row.flagged ? '✅ Yes' : '❌ No'}</td>
                <td>{row.risk_label ?? 'Pending'}</td>
                <td>
                  {row.confidence_score !== undefined
                    ? row.confidence_score.toFixed(2)
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
