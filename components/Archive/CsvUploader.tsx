import React, { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabaseClient'; // adjust path if needed
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

type ScreeningInputRow = {
  row: string;
  name: string;
  contact_details?: string;
  shipping_address?: string;
  billing_address?: string;
  ip_address?: string;
  is_vpn?: string;
  flagged?: string;
  matched_sanction_list?: string;
  high_risk_country?: string;
  pep_match?: string;
  match_probability?: string;
  decision?: string;
  reason_code?: string;
};

interface CsvUploaderProps {
  onUploadComplete: () => void;
  setErrorMessage: (msg: string) => void;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ onUploadComplete, setErrorMessage }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const parseAndUpload = async (file: File) => {
    setErrorMessage('');
    setUploading(true);
    setUploadProgress(null);

    Papa.parse<ScreeningInputRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Basic validation - require row and name fields
          const data = results.data.filter(row => row.row && row.name);

          if (data.length === 0) {
            setErrorMessage('No valid rows found in CSV. Ensure "row" and "name" columns are present.');
            setUploading(false);
            return;
          }

          // Convert data fields as needed here, e.g. booleans and numbers
          const formattedData = data.map((row) => ({
            user_id: '', // to be set in backend based on session
            row: Number(row.row),
            name: row.name,
            contact_details: row.contact_details || '',
            shipping_address: row.shipping_address || '',
            billing_address: row.billing_address || '',
            ip_address: row.ip_address || '',
            is_vpn: row.is_vpn?.toLowerCase() === 'true' || false,
            flagged: row.flagged?.toLowerCase() === 'true' || false,
            matched_sanction_list: row.matched_sanction_list || '',
            high_risk_country: row.high_risk_country?.toLowerCase() === 'true' || false,
            pep_match: row.pep_match?.toLowerCase() === 'true' || false,
            match_probability: parseFloat(row.match_probability || '0'),
            decision: row.decision || '',
            reason_code: row.reason_code || '',
          }));

          // Send to your backend API for screening processing
          const res = await fetch('/api/screening', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: formattedData, filename: file.name }),
          });

          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Upload failed');

          onUploadComplete();
        } catch (err: any) {
          setErrorMessage(err.message || 'Unknown error during upload');
        } finally {
          setUploading(false);
          setUploadProgress(null);
        }
      },
      error: (err) => {
        setErrorMessage(`CSV parse error: ${err.message}`);
        setUploading(false);
      },
    });
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">Upload Customer Data CSV</h2>
      <input
        type="file"
        accept=".csv"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) parseAndUpload(file);
        }}
        className="border p-2 rounded w-full"
      />
      {uploading && (
        <div className="mt-4 flex items-center space-x-2">
          <LoadingSpinner />
          <span>Uploading and processing...</span>
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
