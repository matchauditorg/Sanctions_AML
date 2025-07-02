// utils/withAuth.tsx
//This wrapper redirects unauthenticated users to /login.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function withAuth(Component: any) {
  return function ProtectedPage(props: any) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace('/login');
        } else {
          setLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (loading) return <p>Checking authentication...</p>;
    return <Component {...props} />;
  };
}
