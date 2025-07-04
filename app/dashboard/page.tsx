// File: app/dashboard/page.tsx
// Purpose: This is the main landing page after a merchant logs in. 
// It shows a high-level overview of their recent screening activity and key statistics.

import { supabase } from '@/lib/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { MatchConfidenceBadge } from '@/components/MatchConfidenceBadge';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: results } = await supabase
    .from('screening_results')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome back!</h1>
      <p className="mb-6 text-gray-600">
        Here are your most recent screening results:
      </p>

      {results?.length === 0 ? (
        <p>No recent results found. Upload a CSV to get started.</p>
      ) : (
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Match %</th>
              <th className="p-2">Sanction</th>
              <th className="p-2">PEP</th>
              <th className="p-2">Risk Country</th>
              <th className="p-2">Decision</th>
            </tr>
          </thead>
          <tbody>
            {results?.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2">
                  <MatchConfidenceBadge score={r.match_probability} />
                </td>
                <td className="p-2">{r.matched_sanction_list ? '✅' : '❌'}</td>
                <td className="p-2">{r.pep_match ? '✅' : '❌'}</td>
                <td className="p-2">{r.high_risk_country ? '✅' : '❌'}</td>
                <td className="p-2 font-semibold">{r.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
