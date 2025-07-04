/**
 * Page: /screening
 * 
 * 🌟 PURPOSE:
 * - Provides a UI for uploading a CSV file containing sanction/PEP screening results.
 * - Parses the uploaded file in-browser and prepares the data in the expected structure.
 * - Sends the parsed results to the backend API for database insertion.
 * - Displays real-time success or error feedback to the user.
 * 
 * This tool enables non-technical users to easily upload screening files with one click.
 */

import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

interface ScreeningResult {
  row: number;
  name: string;
  flagged: boolean;
}

const ScreeningPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  /**
   * 📂 Triggered when a user selects a file using the input element
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    setUploadStatus('');
  };

  /**
   * 🧠 Converts CSV rows into ScreeningResult format
   */
  const parseCSV = (csvText: string): ScreeningResult[] => {
    const results: ScreeningResult[] = [];
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      throw new Error(`CSV Parse Error: ${parsed.errors[0].message}`);
    }

    parsed.data.forEach((row: any, index: number) => {
      const rowNumber = parseInt(row.row, 10);
      const flaggedValue = row.flagged?.toLowerCase?.() === 'true';

      if (!isNaN(rowNumber) && row.name) {
        results.push({
          row: rowNumber,
          name: row.name.trim(),
          flagged: flaggedValue,
        });
      }
    });

    return results;
  };

  /**
   * 🚀 Reads the file, parses it, and sends it to the API
   */
  const handleUpload = () => {
    if (!file) {
      setUploadStatus('⚠️ Please select a CSV file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvText = e.target?.result as string;
        const structuredData = parseCSV(csvText);

        // 📨 Send parsed data to backend
        const response = await axios.post('/api/screening', {
          data: structuredData,
          filename: file.name,
        });

        if (response.status === 200) {
          setUploadStatus('✅ Data uploaded successfully!');
        } else {
          setUploadStatus('❌ Upload failed: ' + response.data.error);
        }
      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadStatus('❌ Upload failed: ' + (err.message || 'Unknown error'));
      }
    };

    reader.onerror = () => {
      setUploadStatus('❌ File reading error.');
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧾 Upload Sanctions / PEP Screening Results</h2>
      <p>
        Please upload a <strong>CSV file</strong> containing the columns: <code>row</code>, <code>name</code>, and <code>flagged</code>.
      </p>

      {/* 📁 File Upload Input */}
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />

      {/* ⬆️ Upload Button */}
      <button
        onClick={handleUpload}
        style={{ padding: '0.5rem 1rem', backgroundColor: '#1976d2', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Upload
      </button>

      {/* 🧾 Upload Status Feedback */}
      <p style={{ marginTop: '1rem', color: uploadStatus.startsWith('✅') ? 'green' : 'red' }}>
        {uploadStatus}
      </p>
    </div>
  );
};

export default ScreeningPage;
