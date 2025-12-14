import {
  and,
  arrayContains,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
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
  tags?: string[]
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

  async findAll(params: ListModsParams) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params
    const offset = (page - 1) * limit

    const conditions = [eq(mods.isActive, true)]

    if (search) {
      const searchCondition = or(
        ilike(mods.name, `%${search}%`),
        ilike(mods.workshopId, `%${search}%`),
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    let orderByClause = desc(mods.createdAt)

    if (sortBy === 'createdAt') {
      orderByClause =
        sortOrder === 'asc' ? asc(mods.createdAt) : desc(mods.createdAt)
    } else if (sortBy === 'updatedAt') {
      orderByClause =
        sortOrder === 'asc' ? asc(mods.updatedAt) : desc(mods.updatedAt)
    }

    const [{ count: total }] = await database
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(mods)
      .where(and(...conditions))

    const data = await database
      .select()
      .from(mods)
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async list(params: ListModsParams) {
    const {
      page = 1,
      limit = 10,
      search,
      modpackId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params
    const offset = (page - 1) * limit

    const conditions = [
      eq(mods.isActive, true),
      eq(modpacksMods.isActive, true),
    ]

    if (modpackId) {
      conditions.push(eq(modpacksMods.modpackId, modpackId))
    }

    if (search) {
      const searchCondition = or(
        ilike(mods.name, `%${search}%`),
        ilike(mods.workshopId, `%${search}%`),
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    let orderByClause = desc(modpacksMods.createdAt)

    if (sortBy === 'createdAt') {
      orderByClause =
        sortOrder === 'asc'
          ? asc(modpacksMods.createdAt)
          : desc(modpacksMods.createdAt)
    } else if (sortBy === 'updatedAt') {
      orderByClause =
        sortOrder === 'asc'
          ? asc(modpacksMods.updatedAt)
          : desc(modpacksMods.updatedAt)
    }

    const [{ count: total }] = await database
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(mods)
      .innerJoin(modpacksMods, eq(mods.id, modpacksMods.modId))
      .where(and(...conditions))

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

    return {
      data: data.map((row) => ({
        ...row.mod,
        addedAt: row.addedAt,
        updatedAt: row.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}

export const modRepository = new ModRepository()
