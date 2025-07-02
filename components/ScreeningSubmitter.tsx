import { useState } from 'react';

export default function ScreeningSubmitter() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // This is the sample data you want to send to screening API
  const dataToSend = [
    { name: 'John Doe' },
    { name: 'Jane Smith' },
  ];

  async function sendScreening() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataToSend }),
      });

      const json = await res.json();
      setResult(json);
    } catch (err) {
      setError('Failed to send screening request');
    }

    setLoading(false);
  }

  return (
    <div>
      <button onClick={sendScreening} disabled={loading}>
        {loading ? 'Sending...' : 'Send Screening Data'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
          <h4>Response:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
