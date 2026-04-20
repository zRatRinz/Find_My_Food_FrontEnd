"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex-grow flex items-center justify-center px-6 py-12 text-luxury-text font-sans selection:bg-blue-200 overflow-hidden">
      {/* --- Atmospheric Blobs (Synced with HomeView) --- */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Number at the Top */}
        <h1 className="text-[6rem] md:text-[9rem] font-serif font-black leading-none tracking-tighter text-luxury-text mb-4">
          404
        </h1>

        {/* Editorial Content */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-serif italic font-medium leading-tight">
            The page you seek <br />
            <span className="not-italic font-black uppercase tracking-tighter text-luxury-accent-start block mt-1">
              is currently missing
            </span>
          </h2>

          <div className="max-w-md mx-auto mt-6">
            <p className="text-sm font-light text-luxury-text-muted leading-relaxed mb-8">
              It seems you've wandered off the curated path.
              The destination you're looking for may have been moved or no longer exists in our archives.
            </p>

            <Link
              href="/"
              className="group relative inline-flex items-center gap-3 px-8 py-3 bg-luxury-gradient text-white rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all duration-300 shadow-xl shadow-luxury-accent-start/20 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
