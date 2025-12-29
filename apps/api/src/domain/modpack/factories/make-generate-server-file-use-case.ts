import {
  ModpackExportRepository,
  ModpackModRepository,
  ModpackRepository,
} from '@org/database/repository'
import { GenerateServerFileUseCase } from '../use-cases/generate-server-file'

export function makeGenerateServerFileUseCase() {
  const modpackModRepository = new ModpackModRepository()
  const modpackExportRepository = new ModpackExportRepository()
  const modpackRepository = new ModpackRepository()
  return new GenerateServerFileUseCase(
    modpackModRepository,
    modpackExportRepository,
    modpackRepository,
  )
}
