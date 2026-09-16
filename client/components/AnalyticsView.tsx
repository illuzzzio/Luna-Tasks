import React from 'react';
import { BarChart3, PieChart, TrendingUp, Award, Calendar, CheckCircle, Clock } from 'lucide-react';

export function AnalyticsView({ tasks }: { tasks: any[] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const urgentCount = tasks.filter(t => t.priority === 'Urgent').length;
  const highCount = tasks.filter(t => t.priority === 'High').length;
  const mediumCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowCount = tasks.filter(t => t.priority === 'Low').length;

  const academicCount = tasks.filter(t => t.category === 'Academic').length;
  const researchCount = tasks.filter(t => t.category === 'Research').length;
  const examCount = tasks.filter(t => t.category === 'Exam').length;
  const personalCount = tasks.filter(t => t.category === 'Personal').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Performance & Statistics</h2>
        <p className="text-neutral-400 text-sm">
          Deep telemetry and breakdown of your academic workload, priorities, and study habits.
        </p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Status */}
        <div className="rounded-2xl bg-gradient-to-b from-neutral-900 to-black p-6 border border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-neutral-400" />
              Completion Ratio
            </h3>
            <span className="text-xs font-mono text-neutral-400 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800">
              Live Status
            </span>
          </div>
          <div className="flex items-center justify-center py-6">
            <div className="relative w-36 h-36 rounded-full bg-neutral-950 border-4 border-neutral-800 flex flex-col items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)]">
              <span className="text-3xl font-black text-white">{completionRate}%</span>
              <span className="text-xs text-neutral-500 font-medium">Completed</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80 text-center">
            <div>
              <p className="text-xs text-neutral-500">Completed</p>
              <p className="text-lg font-bold text-white">{completed}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Pending</p>
              <p className="text-lg font-bold text-white">{pending}</p>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="rounded-2xl bg-gradient-to-b from-neutral-900 to-black p-6 border border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-neutral-400" />
              Priority Matrix
            </h3>
            <span className="text-xs font-mono text-neutral-400 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800">
              Weights
            </span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Urgent', count: urgentCount, color: 'bg-red-500' },
              { label: 'High', count: highCount, color: 'bg-amber-500' },
              { label: 'Medium', count: mediumCount, color: 'bg-neutral-400' },
              { label: 'Low', count: lowCount, color: 'bg-neutral-600' },
            ].map((item, idx) => {
              const pct = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-neutral-300">
                    <span>{item.label}</span>
                    <span className="font-mono">{item.count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl bg-gradient-to-b from-neutral-900 to-black p-6 border border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-neutral-400" />
              Category Focus
            </h3>
            <span className="text-xs font-mono text-neutral-400 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800">
              Sectors
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Academic', count: academicCount },
              { label: 'Research', count: researchCount },
              { label: 'Exam', count: examCount },
              { label: 'Personal', count: personalCount },
            ].map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <span className="text-xs font-medium text-neutral-300">{cat.label}</span>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-neutral-900 text-white border border-neutral-800">
                  {cat.count} tasks
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
