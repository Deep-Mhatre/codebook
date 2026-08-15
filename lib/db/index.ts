import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/codebook';

// Connection client for query execution
const client = postgres(connectionString, { max: 10, ssl: 'require' });
export const db = drizzle(client, { schema });
