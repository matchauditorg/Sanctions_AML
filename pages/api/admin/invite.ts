// pages/api/admin/invite.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminSecret = process.env.ADMIN_SECRET!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check admin secret token for authorization
  if (req.headers['x-admin-secret'] !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'Missing email or role' });
  }

  try {
    // Invite user (creates user with email, no password set)
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, { role });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: `Invitation sent to ${email}`, data });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
