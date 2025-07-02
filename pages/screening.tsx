// This is the page where users upload the CSV file and send it to your Supabase backend.
// It parses the CSV, validates each row, and sends it to the `/api/screening` API route.

import React, { useState } from 'react';
import Papa from 'papaparse';

interface ScreeningData {
  row: number;
  name: string;
  flagged: boolean;
}

export default function ScreeningPage() {
  const [csvData, setCsvData] = useState<ScreeningData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // This function handles file selection and parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile); // Save the file for later (to get filename)

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data as Papa.ParseResult<ScreeningData>['data'];

          // Validate and clean the parsed data
          const validatedData = parsedData
            .map((row: any) => {
              return {
                row: Number(row.row),
                name: String(row.name),
                flagged: row.flagged === 'true' || row.flagged === true,
              };
            })
            .filter((row) =>
              typeof row.row === 'number' &&
              !isNaN(row.row) &&
              typeof row.name === 'string' &&
              typeof row.flagged === 'boolean'
            );

          setCsvData(validatedData);
          setUploadStatus(`✅ Parsed ${validatedData.length} records`);
        } catch (error) {
          console.error('CSV Parse Error:', error);
          setUploadStatus('❌ Failed to parse CSV');
        }
      },
      error: (err) => {
        console.error('PapaParse Error:', err);
        setUploadStatus('❌ Error parsing CSV');
      }
    });
  };

  // This function sends parsed data to the API route for Supabase insertion
  const handleSendData = async () => {
    if (!csvData.length || !file) {
      setUploadStatus('❌ No data or file selected');
      return;
    }

    try {
      const response = await fetch('/api/screening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: csvData,
          filename: file.name, // Send the original filename to API
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setUploadStatus(`❌ Server error: ${result.error || 'Unknown error'}`);
      } else {
        setUploadStatus('✅ Data inserted successfully!');
        setCsvData([]);
        setFile(null);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setUploadStatus('❌ Upload failed: ' + error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧾 Screening CSV Upload</h1>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />

      <button
        onClick={handleSendData}
        disabled={!csvData.length}
        style={{ padding: '0.5rem 1rem' }}
      >
        Send Screening Data
      </button>

      <p>{uploadStatus}</p>

      {csvData.length > 0 && (
        <div>
          <h3>Preview (first 5 rows):</h3>
          <table border={1} cellPadding={5}>
            <thead>
              <tr>
                <th>Row</th>
                <th>Name</th>
                <th>Flagged</th>
              </tr>
            </thead>
            <tbody>
              {csvData.slice(0, 5).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.row}</td>
                  <td>{item.name}</td>
                  <td>{item.flagged ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
