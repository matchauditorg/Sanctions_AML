/**
 * DashboardNav.tsx
 * 
 * Sidebar navigation menu for authenticated users within the merchant dashboard.
 * Displays links to Upload, Results, Lookup, Report, and Settings pages.
 * Responsive with basic styling using TailwindCSS.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Upload CSV', href: '/dashboard/upload' },
    { label: 'Screening Results', href: '/dashboard/results' },
    { label: 'Reason Codes Lookup', href: '/dashboard/lookup' },
    { label: 'Reports', href: '/dashboard/report' },
    { label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <nav className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-8">Merchant Dashboard</h1>
      <ul>
        {navItems.map(({ label, href }) => (
          <li key={href} className="mb-3">
            <Link
              href={href}
              className={`block py-2 px-3 rounded ${
                pathname === href ? 'bg-gray-600 font-semibold' : 'hover:bg-gray-700'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
