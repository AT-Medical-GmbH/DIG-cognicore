'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SignalFeed from '@/components/SignalFeed';

export default function SignalsPage() {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar activeRoute="/dashboard/signals" />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 px-6 py-4 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
          <h1 className="text-xl font-black text-white">Signale & Fragen</h1>
          <p className="text-xs text-gray-500">Eingehende Audience-Signale in Echtzeit</p>
        </header>

        <div className="p-6">
          <SignalFeed />
        </div>
      </main>
    </div>
  );
}
