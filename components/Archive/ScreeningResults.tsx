import React from 'react';

export type ScreeningResult = {
  id: string;
  row: number;
  name: string;
  contact_details?: string;
  shipping_address?: string;
  billing_address?: string;
  ip_address?: string;
  is_vpn?: boolean;
  flagged: boolean;
  matched_sanction_list?: string;
  high_risk_country?: boolean;
  pep_match?: boolean;
  match_probability?: number;
  decision?: string;
  reason_code?: string;
};

interface ScreeningResultsProps {
  results: ScreeningResult[];
  reasonCodeLookup: Record<string, string>;
}

const ScreeningResults: React.FC<ScreeningResultsProps> = ({ results, reasonCodeLookup }) => {
  if (results.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No screening results to display.</p>;
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Row</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Flagged</th>
            <th className="p-2 border">Match Probability</th>
            <th className="p-2 border">Decision</th>
            <th className="p-2 border">Reason</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.id}
              className={r.flagged ? 'bg-red-100 font-semibold' : ''}
            >
              <td className="p-2 border text-center">{r.row}</td>
              <td className="p-2 border">{r.name}</td>
              <td className="p-2 border text-center">{r.flagged ? 'Yes' : 'No'}</td>
              <td className="p-2 border text-center">{(r.match_probability ?? 0).toFixed(2)}</td>
              <td className="p-2 border text-center">{r.decision || '-'}</td>
              <td className="p-2 border" title={reasonCodeLookup[r.reason_code || ''] || 'No reason code'}>
                {reasonCodeLookup[r.reason_code || ''] || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScreeningResults;
