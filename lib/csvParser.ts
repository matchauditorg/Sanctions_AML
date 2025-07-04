// lib/csvParser.ts

/**
 * Purpose:
 * Utility to parse CSV text into an array of objects, where each object
 * represents a row with keys from the CSV header.
 * 
 * This parser:
 * - Supports commas as delimiters
 * - Trims whitespace
 * - Skips empty lines
 * - Handles basic quoted values (e.g., "some, text")
 * - Returns typed generic array for better TypeScript safety
 * 
 * Usage:
 * const rows = parseCSV<MyRowType>(csvText);
 */

export function parseCSV<T = Record<string, string>>(csvText: string): T[] {
  // Split the text by newline to separate rows
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length === 0) {
    return [];
  }

  // Extract headers from the first line
  const headers = parseCSVLine(lines[0]);

  // Parse each subsequent line into an object mapping header => value
  const rows: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // skip empty lines

    const values = parseCSVLine(line);

    // If row length doesn't match header length, skip or throw error
    if (values.length !== headers.length) {
      // Optionally, throw an error or log a warning here
      console.warn(`Skipping malformed CSV row ${i + 1}: column count mismatch`);
      continue;
    }

    const row: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j];
    }

    rows.push(row as T);
  }

  return rows;
}

/**
 * Parse a single CSV line into array of strings,
 * respecting quoted values that may contain commas.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Toggle inQuotes flag
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      // End of current value
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  // Push the last value
  result.push(current.trim());

  return result;
}
