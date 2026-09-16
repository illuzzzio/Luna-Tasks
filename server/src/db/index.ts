import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://dummy:dummy@localhost:5432/dummy';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
