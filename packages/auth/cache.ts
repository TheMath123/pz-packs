import { redisClient } from '@org/cache'

const createResilientCache = () => {
  let isAvailable = true

  redisClient.ping().catch(() => {
    console.warn('⚠️ Redis not available - Better Auth will work without cache')
    isAvailable = false
  })

  redisClient.on('error', () => {
    isAvailable = false
  })

  redisClient.on('ready', () => {
    isAvailable = true
    console.log('✅ Redis reconnected')
  })

  return {
    async delete(key: string): Promise<string> {
      if (!isAvailable) return '0'

      try {
        const result = await redisClient.del(key)
        return String(result)
      } catch (error) {
        console.error('Cache delete error:', error)
        isAvailable = false
        return '0'
      }
    },

    async get(key: string): Promise<string | null> {
      if (!isAvailable) return null

      try {
        return await redisClient.get(key)
      } catch (error) {
        console.error('Cache get error:', error)
        isAvailable = false
        return null
      }
    },

    async set(key: string, value: string): Promise<void> {
      if (!isAvailable) return

      try {
        await redisClient.set(key, value)
      } catch (error) {
        console.error('Cache set error:', error)
        isAvailable = false
      }
    },
  }
}

export const resilientCache = createResilientCache()
