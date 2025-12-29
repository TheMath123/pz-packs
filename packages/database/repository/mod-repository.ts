import {
  and,
  arrayContains,
  arrayOverlaps,
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
import { modpacksMods, mods, tags } from '../schemas'

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
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
  tags?: string[]
}

export interface TagSummary {
  id: string
  name: string
}

export interface ModWithTags extends Omit<DMod, 'tags'> {
  tags: TagSummary[]
}

export class ModRepository {
  private async enrichWithTags(modsList: DMod[]): Promise<ModWithTags[]> {
    const allTagIds = new Set<string>()
    modsList.forEach((mod) => {
      mod.tags?.forEach((t) => {
        allTagIds.add(t)
      })
    })

    const tagMap = new Map<string, TagSummary>()
    if (allTagIds.size > 0) {
      const foundTags = await database
        .select({ id: tags.id, name: tags.name })
        .from(tags)
        .where(inArray(tags.id, Array.from(allTagIds)))

      foundTags.forEach((t) => {
        tagMap.set(t.id, t)
      })
    }

    return modsList.map((mod) => ({
      ...mod,
      tags:
        mod.tags
          ?.map((tid) => tagMap.get(tid))
          .filter((t): t is TagSummary => !!t) || [],
    }))
  }

  async findById(id: string): Promise<ModWithTags | undefined> {
    const mod = await database.query.mods.findFirst({
      where: eq(mods.id, id),
    })
    if (!mod) return undefined
    const [enriched] = await this.enrichWithTags([mod])
    return enriched
  }

  async findByWorkshopId(workshopId: string): Promise<ModWithTags | undefined> {
    const mod = await database.query.mods.findFirst({
      where: eq(mods.workshopId, workshopId),
    })
    if (!mod) return undefined
    const [enriched] = await this.enrichWithTags([mod])
    return enriched
  }

  async findBySteamModId(steamModId: string): Promise<ModWithTags | undefined> {
    const mod = await database.query.mods.findFirst({
      where: arrayContains(mods.steamModId, [steamModId]),
    })
    if (!mod) return undefined
    const [enriched] = await this.enrichWithTags([mod])
    return enriched
  }

  async findByWorkshopIds(workshopIds: string[]): Promise<ModWithTags[]> {
    if (workshopIds.length === 0) return []
    const modsList = await database.query.mods.findMany({
      where: inArray(mods.workshopId, workshopIds),
    })
    return this.enrichWithTags(modsList)
  }

  async create(data: CreateModData): Promise<ModWithTags> {
    const [mod] = await database.insert(mods).values(data).returning()
    const [enriched] = await this.enrichWithTags([mod])
    return enriched
  }

  async update(
    id: string,
    data: Partial<CreateModData>,
  ): Promise<ModWithTags | undefined> {
    const [mod] = await database
      .update(mods)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(mods.id, id))
      .returning()

    if (!mod) return undefined
    const [enriched] = await this.enrichWithTags([mod])
    return enriched
  }

  async findAll(params: ListModsParams) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      tags,
    } = params
    const offset = (page - 1) * limit

    const conditions = [eq(mods.isActive, true)]

    if (tags && tags.length > 0) {
      conditions.push(arrayOverlaps(mods.tags, tags))
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

    let orderByClause = desc(mods.createdAt)

    if (sortBy === 'createdAt') {
      orderByClause =
        sortOrder === 'asc' ? asc(mods.createdAt) : desc(mods.createdAt)
    } else if (sortBy === 'updatedAt') {
      orderByClause =
        sortOrder === 'asc' ? asc(mods.updatedAt) : desc(mods.updatedAt)
    } else if (sortBy === 'name') {
      orderByClause = sortOrder === 'asc' ? asc(mods.name) : desc(mods.name)
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

    const enrichedData = await this.enrichWithTags(data)

    return {
      data: enrichedData,
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
      tags,
    } = params
    const offset = (page - 1) * limit

    const conditions = [
      eq(mods.isActive, true),
      eq(modpacksMods.isActive, true),
    ]

    if (tags && tags.length > 0) {
      conditions.push(arrayOverlaps(mods.tags, tags))
    }

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
    } else if (sortBy === 'name') {
      orderByClause = sortOrder === 'asc' ? asc(mods.name) : desc(mods.name)
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

    const modsOnly = data.map((row) => row.mod)
    const enrichedMods = await this.enrichWithTags(modsOnly)
    const enrichedMap = new Map(enrichedMods.map((m) => [m.id, m]))

    return {
      data: data.map((row) => ({
        ...(enrichedMap.get(row.mod.id) as ModWithTags),
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
