import {
  and,
  arrayContains,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
} from 'drizzle-orm'
import { database } from '../index'
import type { DMod } from '../schemas'
import { modpacksMods, mods } from '../schemas'

export interface CreateModData {
  name: string
  steamModId: string[]
  workshopId: string
  mapFolders?: string[]
  requiredMods?: string[]
  description?: string
  steamUrl?: string
  avatarUrl?: string
  highlights?: string[]
}

export interface ListModsParams {
  page?: number
  limit?: number
  search?: string
  modpackId?: string
  sortBy?: 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export class ModRepository {
  async findById(id: string): Promise<DMod | undefined> {
    return database.query.mods.findFirst({
      where: eq(mods.id, id),
    })
  }

  async findByWorkshopId(workshopId: string): Promise<DMod | undefined> {
    return database.query.mods.findFirst({
      where: eq(mods.workshopId, workshopId),
    })
  }

  async findBySteamModId(steamModId: string): Promise<DMod | undefined> {
    return database.query.mods.findFirst({
      where: arrayContains(mods.steamModId, [steamModId]),
    })
  }

  async findByWorkshopIds(workshopIds: string[]): Promise<DMod[]> {
    if (workshopIds.length === 0) return []
    return database.query.mods.findMany({
      where: inArray(mods.workshopId, workshopIds),
    })
  }

  async create(data: CreateModData): Promise<DMod> {
    const [mod] = await database.insert(mods).values(data).returning()
    return mod
  }

  async list(params: ListModsParams) {
    const page = params.page || 1
    const limit = params.limit || 10
    const offset = (page - 1) * limit

    const conditions = [
      eq(mods.isActive, true),
      eq(modpacksMods.isActive, true),
    ]

    if (params.modpackId) {
      conditions.push(eq(modpacksMods.modpackId, params.modpackId))
    }

    if (params.search) {
      const searchCondition = or(
        ilike(mods.name, `%${params.search}%`),
        ilike(mods.workshopId, `%${params.search}%`),
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    let orderByClause = desc(modpacksMods.createdAt)

    if (params.sortBy === 'createdAt') {
      orderByClause =
        params.sortOrder === 'asc'
          ? asc(modpacksMods.createdAt)
          : desc(modpacksMods.createdAt)
    } else if (params.sortBy === 'updatedAt') {
      orderByClause =
        params.sortOrder === 'asc'
          ? asc(modpacksMods.updatedAt)
          : desc(modpacksMods.updatedAt)
    }

    const data = await database
      .select({
        mod: mods,
        addedAt: modpacksMods.createdAt,
        updatedAt: modpacksMods.updatedAt,
      })
      .from(mods)
      .innerJoin(modpacksMods, eq(mods.id, modpacksMods.modId))
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)

    const total = await database
      .select({ count: count() })
      .from(mods)
      .innerJoin(modpacksMods, eq(mods.id, modpacksMods.modId))
      .where(and(...conditions))
      .then((res) => res[0].count)

    return {
      data: data.map((row) => ({
        ...row.mod,
        addedAt: row.addedAt,
        updatedAt: row.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}

export const modRepository = new ModRepository()
