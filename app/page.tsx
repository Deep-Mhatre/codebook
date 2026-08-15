'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-browser';
import NotebookPage from './notebook/page';
import LandingPage from './landing/page';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Initial session check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show neutral dark background during initial auth state verification
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#000000]" />;
  }

  // Render Notebook Canvas for logged-in users, Landing Page for guests
  return isAuthenticated ? <NotebookPage /> : <LandingPage />;
}
