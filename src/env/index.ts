import { z } from "zod";
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test'})
} else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000),
    HOST: z.coerce.string().default('0.0.0.0')
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error('⚠️ invalid environment variables', _env.error.format())
    throw new Error('Invalid environment variables')
}



export const env = _env.data