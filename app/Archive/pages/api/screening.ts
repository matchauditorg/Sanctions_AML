/**
 * API Endpoint: /api/screening
 *
 * 🌟 PURPOSE:
 * - Receive uploaded screening CSV data from frontend.
 * - Perform basic AI-based screening using string similarity to detect fuzzy matches.
 * - Assign risk labels ("Likely High Risk", "Low Confidence") based on match score.
 * - Insert screening results into `screening_results` table with flags and labels.
 * - Log upload metadata into `upload_history` for traceability.
 *
 * This logic enhances detection by catching near-matches and ambiguous names.
 */

import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import stringSimilarity from 'string-similarity';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Interface for incoming screening records
interface ScreeningInput {
  row: number;
  name: string;
  flagged: boolean;  // original flag from uploaded data
}

// Interface for output record to save to DB with AI labels
interface ScreeningResult extends ScreeningInput {
  risk_label: string;   // AI-generated label
  confidence_score: number; // similarity score (0-1)
  created_at?: string;
}

// Example watchlist names for matching (in production, this could come from a DB table)
const watchlistNames = [
  'John Doe',
  'Jane Smith',
  'Robert Johnson',
  'Alice Williams',
  'Michael Brown',
];

/**
 * Returns a risk label and confidence based on AI scoring logic.
 *
 * @param name - The name to check
 * @returns risk_label and confidence_score
 */
function evaluateRisk(name: string): { risk_label: string; confidence_score: number } {
  // Calculate highest similarity against watchlist names
  const matches = stringSimilarity.findBestMatch(name.toLowerCase(), watchlistNames.map(n => n.toLowerCase()));

  const bestMatch = matches.bestMatch;
  const score = bestMatch.rating; // 0 to 1

  // Basic labeling logic
  if (score > 0.85) {
    // Strong fuzzy match, likely high risk
    return { risk_label: 'Likely High Risk', confidence_score: score };
  } else if (score > 0.5) {
    // Moderate match, low confidence
    return { risk_label: 'Low Confidence', confidence_score: score };
  } else {
    // No significant match
    return { risk_label: 'No Risk Detected', confidence_score: score };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, filename } = req.body;

  // Validate input is an array
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid payload. Expected an array of records.' });
  }

  // Validate each item structure
  const isValid = data.every(
    (item) =>
      typeof item.row === 'number' &&
      typeof item.name === 'string' &&
      typeof item.flagged === 'boolean'
  );

  if (!isValid) {
    return res.status(400).json({
      error:
        'Invalid data structure. Each record must contain: row (number), name (string), flagged (boolean)',
    });
  }

  // Generate timestamp for batch
  const timestamp = new Date().toISOString();

  // Apply AI evaluation and build results array for DB insert
  const resultsToInsert: ScreeningResult[] = data.map((record: ScreeningInput) => {
    const { risk_label, confidence_score } = evaluateRisk(record.name);

    return {
      ...record,
      risk_label,
      confidence_score,
      created_at: timestamp,
    };
  });

  // Insert results into screening_results table
  const { error: insertError } = await supabase.from('screening_results').insert(resultsToInsert);

  if (insertError) {
    console.error('Error inserting screening results:', insertError);
    return res.status(500).json({ error: 'Failed to insert screening results', details: insertError.message });
  }

  // Log upload metadata
  const { error: historyError } = await supabase.from('upload_history').insert([
    {
      filename: filename || 'unknown.csv',
      num_records: data.length,
      uploaded_at: timestamp,
    },
  ]);

  if (historyError) {
    console.error('Error logging upload history:', historyError);
    return res.status(500).json({ error: 'Failed to log upload history', details: historyError.message });
  }

  // Success response with summary counts
  const flaggedCount = resultsToInsert.filter(r => r.risk_label === 'Likely High Risk').length;

  return res.status(200).json({
    message: 'Screening completed successfully.',
    totalRecords: data.length,
    flaggedRecords: flaggedCount,
  });
}
