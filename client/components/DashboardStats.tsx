import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export function DashboardStats({ tasks }: { tasks: any[] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const urgent = tasks.filter(t => t.priority === 'Urgent' && !t.completed).length;
  const academic = tasks.filter(t => t.category === 'Academic').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: total,
      icon: Layers,
      color: 'from-neutral-700 to-neutral-900',
      border: 'border-neutral-700',
      desc: 'All active items'
    },
    {
      title: 'Pending Tasks',
      value: pending,
      icon: Clock,
      color: 'from-zinc-700 to-zinc-900',
      border: 'border-zinc-700',
      desc: 'Requires attention'
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'from-neutral-600 to-neutral-800',
      border: 'border-neutral-600',
      desc: `${completionRate}% success rate`
    },
    {
      title: 'Urgent Priority',
      value: urgent,
      icon: AlertCircle,
      color: 'from-zinc-600 to-zinc-800',
      border: 'border-zinc-500',
      desc: 'High priority queue'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-neutral-800 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform-gpu transition-all hover:scale-[1.01]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-neutral-700/10 via-neutral-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-medium text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              Academic Command Station
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Master Your Schedule & Goals
            </h2>
            <p className="text-neutral-400 max-w-xl text-sm leading-relaxed">
              Organize coursework, research papers, exams, and personal milestones in a sleek 3D professional workspace backed by Neon & Clerk security.
            </p>
          </div>
          <div className="bg-black/60 border border-neutral-800 rounded-2xl p-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] min-w-[200px] text-center">
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Completion Progress</p>
            <div className="text-4xl font-black text-white mt-1 mb-2 bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              {completionRate}%
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-neutral-200 to-neutral-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with 3D card effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="group relative rounded-2xl bg-gradient-to-b from-neutral-900 to-black p-6 border border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transform-gpu transition-all duration-300 hover:-translate-y-1.5 hover:border-neutral-600 hover:shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} flex items-center justify-center text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-neutral-200" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                  Live
                </span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
              <p className="text-sm font-semibold text-neutral-300">{stat.title}</p>
              <p className="text-xs text-neutral-500 mt-1">{stat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
