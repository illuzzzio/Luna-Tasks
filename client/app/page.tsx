'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useAuth, SignIn, UserButton } from '@clerk/nextjs';
import { Navbar } from '@/components/Navbar';
import { DashboardStats } from '@/components/DashboardStats';
import { TaskManager } from '@/components/TaskManager';
import { AnalyticsView } from '@/components/AnalyticsView';
import { Sparkles, ShieldCheck, Database, Lock } from 'lucide-react';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTasks = async () => {
    if (!isSignedIn) return;
    setIsLoadingTasks(true);
    setErrorMsg('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch tasks from server');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Could not connect to backend server.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Force bypass loading lock on Vercel if isLoaded is delayed
  useEffect(() => {
    const timer = setTimeout(() => {
      // If still stuck after 2 seconds, force hydration check
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTask = async (taskData: any) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create task');
    }
    await fetchTasks();
  };

  const handleUpdateTask = async (id: number, updates: any) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update task');
    }
    await fetchTasks();
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Failed to delete task');
      return;
    }
    await fetchTasks();
  };

  if (!isLoaded && !forceLoad) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-neutral-500 animate-pulse flex items-center justify-center text-black font-black text-xl">
            L
          </div>
          <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">Loading LunaTasks 3D...</p>
        </div>
      </div>
    );
  }

  // Fallback if Clerk takes too long or isn't fully initialized on Vercel
  if (!isSignedIn && isLoaded) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-neutral-800/20 via-neutral-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            Secure Student Workspace
          </div>
          
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-3">
              LUNA<span className="text-neutral-450 font-light">TASKS</span>
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Professional 3D academic command center. Manage tasks, exams, research papers, and deadlines with Clerk authentication & Neon database storage.
            </p>
          </div>

          <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col items-center">
            <div className="mb-4">
              <SignIn routing="hash" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neutral-200 selection:text-black">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-900 text-red-300 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={fetchTasks} className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white rounded-lg text-xs font-semibold">
              Retry Connection
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-fadeIn">
            <DashboardStats tasks={tasks} />
            <div className="pt-6 border-t border-neutral-900">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Academic Tasks</h3>
                  <p className="text-xs text-neutral-500">Quick overview of your active tasks</p>
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-semibold text-neutral-300 hover:text-white underline underline-offset-4"
                >
                  View All Tasks →
                </button>
              </div>
              <TaskManager 
                tasks={tasks.slice(0, 6)} 
                onAddTask={handleAddTask} 
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={handleDeleteTask} 
              />
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">All Tasks Vault</h2>
                <p className="text-neutral-400 text-sm">Manage, filter, prioritize, and track all your academic commitments.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300">
                  Total Items: {tasks.length}
                </span>
                <UserButton />
              </div>
            </div>
            <TaskManager 
              tasks={tasks} 
              onAddTask={handleAddTask} 
              onUpdateTask={handleUpdateTask} 
              onDeleteTask={handleDeleteTask} 
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-end">
              <UserButton />
            </div>
            <AnalyticsView tasks={tasks} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 mt-20 bg-black text-center text-xs text-neutral-600">
        <p>LunaTasks Professional 3D Student Suite • Secured with Clerk & Neon Database</p>
      </footer>
    </div>
  );
}
