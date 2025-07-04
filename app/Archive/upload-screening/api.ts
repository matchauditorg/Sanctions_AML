/**
 * Purpose:
 * - Receive CSV file upload from frontend.
 * - Parse CSV.
 * - Run AI screening logic (mocked here; can integrate real AI).
 * - Insert results into Supabase `screening_results` table.
 * - Return success or error message.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import csv from 'csvtojson';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for backend write
);

// Mock AI screening function for demonstration
function aiScreeningLogic(record: any) {
  // Normally you’d call an AI model or API here.
  // For demo: if name contains "test", mark flagged with 90% probability
  const flagged = record.name.toLowerCase().includes('test');
  return {
    matched_sanction_list: flagged,
    high_risk_country: record.ip_address.startsWith('192.'), // fake logic
    pep_match: false,
    match_probability: flagged ? 90 : 5,
    decision: flagged ? 'BLOCK' : 'ALLOW',
    reason_code: flagged ? 'R001' : 'R000',
  };
}

export const config = {
  api: {
    bodyParser: false, // Disable default parser to handle file upload
  },
};

import multiparty from 'multiparty';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse multipart form with file
  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    if (!files.file || !files.file[0]) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file[0];
    const fileContent = await new Promise<string>((resolve, reject) => {
      const fs = require('fs');
      fs.readFile(file.path, 'utf8', (err: Error | null, data: string) => (err ? reject(err) : resolve(data)));
    });

    const jsonArray = await csv().fromString(fileContent);

    // Process and insert each record with screening logic
    const resultsToInsert = jsonArray.map((record: any, index: number) => {
      const aiResult = aiScreeningLogic(record);

      return {
        user_id: '00000000-0000-0000-0000-000000000001', // Replace with actual merchant/user id from auth context
        row: index + 1,
        name: record.name,
        contact_details: record.contact_details || null,
        shipping_address: record.shipping_address || null,
        billing_address: record.billing_address || null,
        ip_address: record.ip_address || null,
        is_vpn: record.is_vpn === 'true' || record.is_vpn === true,
        matched_sanction_list: aiResult.matched_sanction_list,
        high_risk_country: aiResult.high_risk_country,
        pep_match: aiResult.pep_match,
        match_probability: aiResult.match_probability,
        decision: aiResult.decision,
        reason_code: aiResult.reason_code,
      };
    });

    // Insert results into Supabase table
    const { error } = await supabase.from('screening_results').insert(resultsToInsert);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save screening results.' });
    }

    return res.status(200).json({ processed: resultsToInsert.length });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Server error during file upload.' });
  }
}
