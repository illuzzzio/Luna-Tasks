import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { db } from './db';
import { tasks } from './db/schema';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(clerkMiddleware());

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(1000).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  dueDate: z.string().optional(),
  category: z.string().min(1).default('Academic'),
  completed: z.boolean().optional(),
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all tasks for authenticated user
app.get('/api/tasks', requireAuth(), async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));

    res.json(userTasks);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Create task
app.post('/api/tasks', requireAuth(), async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validation = taskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
    }

    const { title, description, priority, dueDate, category, completed } = validation.data;

    const [newTask] = await db
      .insert(tasks)
      .values({
        userId,
        title,
        description: description || '',
        priority: priority || 'Medium',
        dueDate: dueDate || null,
        category: category || 'Academic',
        completed: completed ?? false,
      })
      .returning();

    res.status(201).json(newTask);
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', requireAuth(), async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const validation = taskSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Build update object safely
    const bodyData = validation.data;
    const updateData: any = {
      updatedAt: new Date(),
    };
    if (bodyData.title !== undefined) updateData.title = bodyData.title;
    if (bodyData.description !== undefined) updateData.description = bodyData.description;
    if (bodyData.priority !== undefined) updateData.priority = bodyData.priority;
    if (bodyData.dueDate !== undefined) updateData.dueDate = bodyData.dueDate;
    if (bodyData.category !== undefined) updateData.category = bodyData.category;
    if (bodyData.completed !== undefined) updateData.completed = bodyData.completed;

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    res.json(updatedTask);
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', requireAuth(), async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const existing = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    res.json({ message: 'Task deleted successfully', id: taskId });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
