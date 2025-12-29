import { modRepository } from '@org/database/repository/mod-repository'
import { notificationRepository } from '@org/database/repository/notification-repository'
import { tagRepository } from '@org/database/repository/tag-repository'
import type { Job } from 'bullmq'
import { UpsertModFromSteamUseCase } from '@/domain/mod/use-cases/upsert-mod-from-steam'
import { env } from '@/env'
import { SteamClient } from '@/shared/steam-client'

const steamClient = new SteamClient(env.STEAM_API_KEY)
const upsertModFromSteamUseCase = new UpsertModFromSteamUseCase(
  modRepository,
  tagRepository,
  steamClient,
)

export const updateAllModsProcessor = async (job: Job) => {
  console.log('Starting update all mods...')
  const { userId } = job.data
  let page = 1
  const limit = 50
  let totalUpdated = 0
  let errors = 0

  try {
    while (true) {
      const { data: mods, pagination } = await modRepository.findAll({
        page,
        limit,
      })

      if (mods.length === 0) break

      for (const mod of mods) {
        try {
          await upsertModFromSteamUseCase.execute(mod.workshopId, {
            forceUpdate: true,
          })

          totalUpdated++
        } catch (err) {
          console.error(`Failed to update mod ${mod.id}:`, err)
          errors++
        }
      }

      if (page >= pagination.totalPages) break
      page++
    }

    if (userId) {
      await notificationRepository.create({
        title: 'Update All Mods Completed',
        content: `Updated ${totalUpdated} mods. Errors: ${errors}`,
        type: 'info',
        userId: userId,
        isRead: false,
      })
    }
  } catch (err) {
    console.error('Fatal error in update all mods:', err)
    if (userId) {
      await notificationRepository.create({
        title: 'Update All Mods Failed',
        content: `Fatal error occurred.`,
        type: 'error',
        userId: userId,
        isRead: false,
      })
    }
  }
}
