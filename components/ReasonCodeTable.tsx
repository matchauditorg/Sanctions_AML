/**
 * ReasonCodeTable.tsx
 * 
 * Displays a lookup table mapping reason codes to their detailed descriptions.
 * Allows merchants to understand screening decision codes.
 */

import React from 'react';

export interface ReasonCode {
  code: string;
  description: string;
}

interface ReasonCodeTableProps {
  codes: ReasonCode[];
}

export default function ReasonCodeTable({ codes }: ReasonCodeTableProps) {
  if (codes.length === 0) {
    return <p className="text-gray-600">No reason codes available.</p>;
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 p-2">Reason Code</th>
          <th className="border border-gray-300 p-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {codes.map(({ code, description }) => (
          <tr key={code} className="odd:bg-white even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-mono">{code}</td>
            <td className="border border-gray-300 p-2">{description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
