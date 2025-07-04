/**
 * Purpose:
 * - Allow merchants to upload CSV files containing customer data.
 * - Trigger backend screening logic on upload.
 * - Show upload status and errors.
 */

'use client';

import React, { useState } from 'react';

export default function UploadScreeningPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a CSV file first.');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/upload-screening/api', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Upload successful! ${data.processed} records processed.`);
      } else {
        setMessage(`Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Upload error: ${(error as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Customer Screening CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload & Screen'}
      </button>
      {message && <p>{message}</p>}
      <p>
        Please upload a CSV file containing columns: <code>name, contact_details, shipping_address, billing_address, ip_address, is_vpn</code>.
      </p>
    </div>
  );
}
