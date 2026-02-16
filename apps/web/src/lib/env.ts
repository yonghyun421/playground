import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().default('file:./local.db'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)
