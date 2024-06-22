import { Redis } from '@upstash/redis'

if (process.env.UPSTASH_REDIS_REST_URL == null)
  throw new Error('Env UPSTASH_REDIS_REST_URL not set!')
if (process.env.UPSTASH_REDIS_REST_TOKEN == null)
  throw new Error('Env UPSTASH_REDIS_REST_TOKEN not set!')
const db = new Redis({
    url:process.env.UPSTASH_REDIS_REST_URL,
    token:process.env.UPSTASH_REDIS_REST_TOKEN
})

export default db