// File: app/dashboard/layout.tsx

/**
 * Purpose: This is the layout wrapper for all pages inside the `/dashboard` route.
 * It includes the authenticated merchant navigation sidebar and sets the dashboard shell structure.
 */

import { ReactNode } from 'react';
import DashboardNav from '@/components/DashboardNav';
import '@/styles/globals.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <DashboardNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
