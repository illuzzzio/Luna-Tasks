import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  priority: text('priority').notNull().default('Medium'),
  dueDate: text('due_date'),
  category: text('category').notNull().default('Academic'),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

