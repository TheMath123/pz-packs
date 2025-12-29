import Redis from 'ioredis'
import { env } from './env'

export const redisClient = new Redis(env.SECONDARY_DATABASE_URL, {
  maxRetriesPerRequest: 20,
})

export const bullmqConnection = redisClient.duplicate({
  maxRetriesPerRequest: null,
})

redisClient.on('error', (err) => {
  console.error('Redis Connection Error:', err)
})

bullmqConnection.on('error', (err) => {
  console.error('BullMQ Client Error:', err)
})
