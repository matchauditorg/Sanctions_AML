import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data: auditRecords, error } = await supabase
    .from('audit_records')
    .select('id, record_name, transactions (id, transaction_date, amount, description)')
    .eq('user_id', user.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(auditRecords);
}
