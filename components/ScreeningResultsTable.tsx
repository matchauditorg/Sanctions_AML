/**
 * ScreeningResultTable.tsx
 * 
 * Displays a table of screening results after CSV upload.
 * Shows name, contact, IP info, match details, decision, and reason code.
 * Includes basic sorting and styled with TailwindCSS.
 */

import React from 'react';

export interface ScreeningResult {
  id: string;
  name: string;
  contactDetails: string;
  shippingAddress: string;
  billingAddress: string;
  ipAddress: string;
  isVpn: boolean;
  matchedSanctionList: boolean;
  highRiskCountry: boolean;
  pepMatch: boolean;
  matchProbability: number;
  decision: 'BLOCK' | 'ALLOW';
  reasonCode: string;
}

interface ScreeningResultTableProps {
  results: ScreeningResult[];
}

export default function ScreeningResultTable({ results }: ScreeningResultTableProps) {
  if (results.length === 0) {
    return <p className="text-gray-600">No screening results to display.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Contact</th>
            <th className="border border-gray-300 p-2">IP Address</th>
            <th className="border border-gray-300 p-2">VPN</th>
            <th className="border border-gray-300 p-2">Sanction Hit</th>
            <th className="border border-gray-300 p-2">High Risk Country</th>
            <th className="border border-gray-300 p-2">PEP Match</th>
            <th className="border border-gray-300 p-2">Confidence</th>
            <th className="border border-gray-300 p-2">Decision</th>
            <th className="border border-gray-300 p-2">Reason Code</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 p-2">{r.name}</td>
              <td className="border border-gray-300 p-2">{r.contactDetails}</td>
              <td className="border border-gray-300 p-2">{r.ipAddress}</td>
              <td className="border border-gray-300 p-2">{r.isVpn ? 'Yes' : 'No'}</td>
              <td className="border border-gray-300 p-2">{r.matchedSanctionList ? 'Yes' : 'No'}</td>
              <td className="border border-gray-300 p-2">{r.highRiskCountry ? 'Yes' : 'No'}</td>
              <td className="border border-gray-300 p-2">{r.pepMatch ? 'Yes' : 'No'}</td>
              <td className="border border-gray-300 p-2">{r.matchProbability.toFixed(1)}%</td>
              <td
                className={`border border-gray-300 p-2 font-semibold ${
                  r.decision === 'BLOCK' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {r.decision}
              </td>
              <td className="border border-gray-300 p-2">{r.reasonCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
