import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(1),
  PORT: z.string().default('5000').transform(Number),
});

export const env = envSchema.parse(process.env);
