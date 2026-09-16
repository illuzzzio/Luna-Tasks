import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Circle, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Tag,
  Clock,
  Sparkles,
  X,
  Check
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: any) => Promise<void>;
  onUpdateTask: (id: number, task: any) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export function TaskManager({ tasks, onAddTask, onUpdateTask, onDeleteTask }: TaskManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Academic');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Academic', 'Research', 'Exam', 'Personal', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setCategory('Academic');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setDueDate(task.dueDate || '');
    setCategory(task.category);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingTask) {
        await onUpdateTask(editingTask.id, {
          title,
          description,
          priority,
          dueDate,
          category,
        });
      } else {
        await onAddTask({
          title,
          description,
          priority,
          dueDate,
          category,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' ? true :
                          statusFilter === 'completed' ? task.completed : !task.completed;

    const matchesPriority = priorityFilter === 'all' ? true : task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' ? true : task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Urgent':
        return 'bg-red-950/80 text-red-300 border-red-800 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'High':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Medium':
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
      default:
        return 'bg-neutral-900 text-neutral-400 border-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-gradient-to-r from-neutral-900 via-black to-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search academic tasks, assignments, research..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-300 focus:outline-none focus:border-neutral-500 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-300 focus:outline-none focus:border-neutral-500 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-300 focus:outline-none focus:border-neutral-500 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Add Task Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 text-black px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            New Task
          </button>
        </div>
      </div>

      {/* Task List / Grid with 3D Effect */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950/50 rounded-3xl border border-neutral-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
            <BookOpen className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No tasks found</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">
            You have no tasks matching your current filters or search query. Create a new task to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl border border-neutral-700 text-sm font-semibold transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group relative rounded-2xl bg-gradient-to-b from-neutral-900 to-black p-6 border transition-all duration-300 transform-gpu hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(255,255,255,0.05)] ${
                task.completed ? 'border-neutral-900 opacity-75' : 'border-neutral-800 hover:border-neutral-600'
              }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-tr-2xl pointer-events-none"></div>

              {/* Top row: Category & Priority */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                  <Tag className="w-3 h-3 text-neutral-400" />
                  {task.category}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className={`text-lg font-bold text-white mb-2 leading-snug ${task.completed ? 'line-through text-neutral-500' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-neutral-400 line-clamp-3 mb-6 leading-relaxed">
                {task.description || 'No additional description provided.'}
              </p>

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-900">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>Due: <strong className="text-white font-mono">{task.dueDate}</strong></span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80">
                <button
                  onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    task.completed
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]'
                      : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                  }`}
                >
                  {task.completed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-neutral-500" />}
                  {task.completed ? 'Completed' : 'Mark Done'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(task)}
                    title="Edit Task"
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete Task"
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-neutral-900 to-black p-8 border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingTask ? 'Edit Academic Task' : 'Create New Academic Task'}
                  </h3>
                  <p className="text-xs text-neutral-500">Fill in task details and parameters</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-900 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Calculus Assignment 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add notes, formulas, requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] cursor-pointer"
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold border border-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 text-black px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
