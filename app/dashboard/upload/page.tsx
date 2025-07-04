'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Upload Page
 *
 * Purpose:
 * Provides merchants a user-friendly interface to upload CSV files containing customer data.
 * The uploaded data will be processed for screening against sanctions, PEP, and high-risk country exposure.
 *
 * Features:
 * - Accept CSV file uploads only
 * - Preview uploaded file name and size
 * - Validate file type
 * - Upload file to Supabase Storage or trigger serverless function to process the CSV
 * - Display loading, success, and error states
 */

export default function UploadPage() {
  // State for selected file and status messages
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Handles file selection from input
   * Validates that the selected file is a CSV file
   */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    setMessage(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setMessage('Please upload a valid CSV file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  /**
   * Handles the upload process when user submits the form
   */
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMessage('No file selected.');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Get current user to create unique storage path (optional)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage('You must be logged in to upload files.');
        setUploading(false);
        return;
      }

      // Create a unique filename including user id and timestamp
      const fileN
