import React from 'react';

interface ReasonCodeLookupProps {
  codes: Record<string, string>;
}

const ReasonCodeLookup: React.FC<ReasonCodeLookupProps> = ({ codes }) => (
  <div className="max-w-md mx-auto my-6 p-4 bg-white rounded shadow">
    <h3 className="text-lg font-semibold mb-3">Reason Codes</h3>
    <ul className="list-disc list-inside space-y-1">
      {Object.entries(codes).map(([code, description]) => (
        <li key={code}>
          <span className="font-mono mr-2">{code}</span> — {description}
        </li>
      ))}
    </ul>
  </div>
);

export default ReasonCodeLookup;
