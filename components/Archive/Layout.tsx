/**
 * Purpose:
 * - Wrap pages with consistent layout (header, footer, nav).
 * - Used to avoid repeating layout code in multiple pages.
 * - Can be extended to include auth checks, sidebars, etc.
 */

import React from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <header style={{ borderBottom: '1px solid #ddd', paddingBottom: 10, marginBottom: 20 }}>
        <nav style={{ display: 'flex', gap: 15 }}>
          <Link href="/">Home</Link>
          <Link href="/upload-screening">Upload Screening</Link>
          <Link href="/screening-results">Results</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/reason-codes">Reason Codes</Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer style={{ marginTop: 50, borderTop: '1px solid #ddd', paddingTop: 10, textAlign: 'center', color: '#666' }}>
        &copy; {new Date().getFullYear()} KYC Screening Platform
      </footer>
    </div>
  );
}
