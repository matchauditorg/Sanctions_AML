// components/ScreeningResultTable.tsx

import React from 'react';
import { ScreeningResult } from '@/types/screening';

interface ScreeningResultTableProps {
  results: ScreeningResult[];
}

/**
 * ScreeningResultTable
 *
 * Displays a styled table of screening results.
 * Receives an array of ScreeningResult objects via props.
 */
export default function ScreeningResultTable({ results }: ScreeningResultTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-md">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
              Flagged
            </th>
            <th className="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
              Match Probability (%)
            </th>
            <th className="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
              Decision
            </th>
            <th className="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
              Reason Code
            </th>
            <th className="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
              Screened At
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              className="hover:bg-gray-100 even:bg-white odd:bg-gray-50"
            >
              <td className="border border-gray-300 p-3 text-sm">{result.name}</td>
              <td className="border border-gray-300 p-3 text-sm">
                {result.flagged ? '✅ Yes' : '❌ No'}
              </td>
              <td className="border border-gray-300 p-3 text-sm">
                {result.match_probability.toFixed(1)}
              </td>
              <td className="border border-gray-300 p-3 text-sm">{result.decision}</td>
              <td className="border border-gray-300 p-3 text-sm">{result.reason_code}</td>
              <td className="border border-gray-300 p-3 text-sm">
                {new Date(result.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
