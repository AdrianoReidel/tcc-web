// components/LayoutWrapper.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isLogged, logout } = useAuth();

  return (
    <div>
      <header className="p-4 bg-gray-800 text-white">
        <nav className="flex items-center justify-between">
          <Link href="/" className="font-bold">
            TCC Adriano
          </Link>
          <div>
            {isLogged ? (
              <>
                <Link href="/home" className="mr-4">
                  Home
                </Link>
                <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-blue-500 px-3 py-1 rounded">
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
