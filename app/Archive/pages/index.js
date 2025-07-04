import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Session:", data);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-blue-800">MatchAudit.io</h1>
      <p className="mt-4 text-gray-600 text-center max-w-xl">
        Upload your entity lists. Screen for sanctions, fraud, and risk automatically. Fast, private, and compliant.
      </p>
      <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
        Get Started
      </button>
    </main>
  );
}
