import {
  modpackMemberRepository,
  modpackModRepository,
  modpackRepository,
  modRepository,
  tagRepository,
} from '@org/database'
import { UpsertModFromSteamUseCase } from '@/domain/mod/use-cases/upsert-mod-from-steam'
import { steamClient } from '@/shared/steam-client'
import { AddModController } from '../controllers/add-mod.controller'
import { AddModToModpackUseCase } from '../use-cases/add-mod-to-modpack'

export function makeAddModController() {
  const upsertModFromSteamUseCase = new UpsertModFromSteamUseCase(
    modRepository,
    tagRepository,
    steamClient,
  )
  const addModToModpackUseCase = new AddModToModpackUseCase(
    modpackModRepository,
    upsertModFromSteamUseCase,
  )
  const controller = new AddModController(
    modpackRepository,
    modpackMemberRepository,
    addModToModpackUseCase,
  )
  return controller
}
