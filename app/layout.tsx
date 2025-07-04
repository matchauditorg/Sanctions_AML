// File: app/layout.tsx

/**
 * Root layout for the Next.js app.
 * Applies global styling and layout structure for all pages.
 */

import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}