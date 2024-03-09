import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { env } from "~/env"

export const db = drizzle(createClient({ url: env.DATABASE_URL }));
