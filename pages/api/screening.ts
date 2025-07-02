// pages/api/screening.ts
// This API route receives screening results from the frontend and inserts them into Supabase.
// It ensures that data is not overwritten and each upload is tracked with a timestamp.

import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

type ScreeningResult = {
  row: number;
  name: string;
  flagged: boolean;
  created_at?: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid payload format. Expected an array.' });
  }

  const isValidStructure = data.every(
    (item) =>
      typeof item.row === 'number' &&
      typeof item.name === 'string' &&
      typeof item.flagged === 'boolean'
  );

  if (!isValidStructure) {
    return res.status(400).json({
      error: 'Invalid data structure. Each item must include "row" (number), "name" (string), "flagged" (boolean).'
    });
  }

  // Add timestamp to each item
  const timestamp = new Date().toISOString();
  const dataWithTimestamp: ScreeningResult[] = data.map((item) => ({
    ...item,
    created_at: timestamp,
  }));

  console.log('Prepared data to insert:', dataWithTimestamp);

  const { error } = await supabase
    .from('screening_results')
    .insert(dataWithTimestamp);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Database insert failed', details: error.message });
  }

  res.status(200).json({ message: 'Data inserted successfully' });
}
