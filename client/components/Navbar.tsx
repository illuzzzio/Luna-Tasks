import React from 'react';

export function Navbar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-neutral-800 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 p-[1px] shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">L</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-white flex items-center gap-2">
              LUNA<span className="text-neutral-400 font-light">TASKS</span>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">Pro 3D</span>
            </h1>
            <p className="text-xs text-neutral-500 font-medium">Academic & Personal Command Center</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'tasks', label: 'All Tasks' },
            { id: 'analytics', label: 'Statistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-neutral-200 to-neutral-400 text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-neutral-400">Secure Vault</p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Neon + Clerk Secured
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
