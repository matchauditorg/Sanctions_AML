/**
 * FileUpload.tsx
 * 
 * Reusable CSV file upload component.
 * Accepts a callback `onFileSelect` that returns the uploaded file.
 * Validates file type and size.
 * Shows error messages on invalid uploads.
 */

import React, { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) {
      setError('Please select a file.');
      return;
    }
    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    onFileSelect(file);
  }

  return (
    <div>
      <label htmlFor="csv-upload" className="block mb-2 font-semibold">
        Upload CSV File
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
