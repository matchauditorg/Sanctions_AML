/**
 * Purpose:
 * - Display the reason codes and their human-readable meanings.
 * - Helps merchants understand why customers were blocked or flagged.
 */

import React from 'react';

const reasonCodes = [
  { code: 'R000', description: 'No risk detected' },
  { code: 'R001', description: 'Name matched on sanctions list' },
  { code: 'R002', description: 'PEP exposure detected' },
  { code: 'R003', description: 'Customer located in high-risk country' },
  { code: 'R004', description: 'VPN usage suspected' },
  { code: 'R005', description: 'Match probability threshold exceeded' },
  // Add more codes as needed
];

export default function ReasonCodesPage() {
  return (
    <div>
      <h1>Reason Codes Lookup</h1>
      <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '50%' }}>
        <thead>
          <tr>
            <th>Reason Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {reasonCodes.map(({ code, description }) => (
            <tr key={code}>
              <td>{code}</td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
