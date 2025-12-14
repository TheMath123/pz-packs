import { and, asc, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import { database } from '../index'
import type { DModpack, DModpackMember } from '../schemas'
import { modpacks, modpacksMembers } from '../schemas'

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateModpackData {
  name: string
  description?: string | null
  avatarUrl?: string | null
  steamUrl?: string | null
  owner: string
  isPublic?: boolean
  isActive?: boolean
}

export interface UpdateModpackData {
  name?: string
  description?: string | null
  avatarUrl?: string | null
  steamUrl?: string | null
  isPublic?: boolean
  isActive?: boolean
}

export class ModpackRepository {
  /**
   * Find a modpack by ID (active only)
   */
  async findById(id: string): Promise<DModpack | undefined> {
    return database.query.modpacks.findFirst({
      where: and(eq(modpacks.id, id), eq(modpacks.isActive, true)),
    })
  }

  /**
   * Find a modpack by name (active only)
   */
  async findByName(name: string): Promise<DModpack | undefined> {
    return database.query.modpacks.findFirst({
      where: and(eq(modpacks.name, name), eq(modpacks.isActive, true)),
    })
  }

  /**
   * Find all modpacks owned by a user (active only)
   */
  async findByOwner(ownerId: string): Promise<DModpack[]> {
    return database.query.modpacks.findMany({
      where: and(eq(modpacks.owner, ownerId), eq(modpacks.isActive, true)),
    })
  }

  /**
   * Find all public modpacks (active only)
   */
  async findPublic(): Promise<DModpack[]> {
    return database.query.modpacks.findMany({
      where: and(eq(modpacks.isPublic, true), eq(modpacks.isActive, true)),
    })
  }

  /**
   * Create a new modpack
   */
  async create(data: CreateModpackData): Promise<DModpack> {
    const [modpack] = await database
      .insert(modpacks)
      .values({
        name: data.name,
        description: data.description,
        avatarUrl: data.avatarUrl,
        steamUrl: data.steamUrl,
        owner: data.owner,
        isPublic: data.isPublic ?? false,
        isActive: data.isActive ?? true,
      })
      .returning()

    return modpack
  }

  /**
   * Update an existing modpack
   */
  async update(id: string, data: UpdateModpackData): Promise<DModpack> {
    const [modpack] = await database
      .update(modpacks)
      .set({
        ...data,
      })
      .where(eq(modpacks.id, id))
      .returning()

    return modpack
  }

  /**
   * Delete a modpack (soft delete - marks as inactive)
   */
  async delete(id: string): Promise<void> {
    await database
      .update(modpacks)
      .set({
        isActive: false,
      })
      .where(eq(modpacks.id, id))
  }

  /**
   * Check if a user is the owner of a modpack (active only)
   */
  async isOwner(modpackId: string, userId: string): Promise<boolean> {
    const modpack = await database.query.modpacks.findFirst({
      where: and(
        eq(modpacks.id, modpackId),
        eq(modpacks.owner, userId),
        eq(modpacks.isActive, true),
      ),
    })

    return !!modpack
  }

  /**
   * Find modpack with its members (active only)
   */
  async findWithMembers(id: string): Promise<
    | (DModpack & {
        members: DModpackMember[]
      })
    | undefined
  > {
    return database.query.modpacks.findFirst({
      where: and(eq(modpacks.id, id), eq(modpacks.isActive, true)),
      with: {
        members: {
          where: eq(modpacksMembers.isActive, true),
        },
      },
    })
  }

  /**
   * Find all modpacks where the user is a member (active only)
   */
  async findByMember(userId: string): Promise<DModpack[]> {
    const members = await database.query.modpacksMembers.findMany({
      where: and(
        eq(modpacksMembers.userId, userId),
        eq(modpacksMembers.isActive, true),
      ),
      with: {
        modpack: true,
      },
    })

    return members
      .filter((member) => member.modpack.isActive)
      .map((member) => member.modpack)
  }

  /**
   * Find public modpacks with pagination and filters
   */
  async findPublicPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<DModpack>> {
    const {
      page,
      limit,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params
    const offset = (page - 1) * limit

    // Build where conditions
    const whereConditions = [
      eq(modpacks.isPublic, true),
      eq(modpacks.isActive, true),
    ]

    if (search) {
      whereConditions.push(ilike(modpacks.name, `%${search}%`))
    }

    // Build order by
    const orderByColumn = modpacks[sortBy]
    const orderByFn = sortOrder === 'asc' ? asc : desc

    // Get total count
    const [{ count }] = await database
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(modpacks)
      .where(and(...whereConditions))

    // Get paginated data
    const data = await database.query.modpacks.findMany({
      where: and(...whereConditions),
      orderBy: orderByFn(orderByColumn),
      limit,
      offset,
      with: {
        mods: true,
      },
    })

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  }

  /**
   * Find user's modpacks (owned + member) with pagination and filters
   */
  async findByUserPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<DModpack>> {
    const {
      page,
      limit,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params
    const offset = (page - 1) * limit

    // Get modpack IDs where user is a member
    const memberModpacks = await database
      .select({ modpackId: modpacksMembers.modpackId })
      .from(modpacksMembers)
      .where(
        and(
          eq(modpacksMembers.userId, userId),
          eq(modpacksMembers.isActive, true),
        ),
      )

    const memberModpackIds = memberModpacks.map((m) => m.modpackId)

    // Build where conditions
    const whereConditions = [eq(modpacks.isActive, true)]

    // User is owner OR member
    if (memberModpackIds.length > 0) {
      const ownerOrMemberCondition = or(
        eq(modpacks.owner, userId),
        inArray(modpacks.id, memberModpackIds),
      )
      if (ownerOrMemberCondition) {
        whereConditions.push(ownerOrMemberCondition)
      }
    } else {
      whereConditions.push(eq(modpacks.owner, userId))
    }

    if (search) {
      whereConditions.push(ilike(modpacks.name, `%${search}%`))
    }

    // Build order by
    const orderByColumn = modpacks[sortBy]
    const orderByFn = sortOrder === 'asc' ? asc : desc

    // Get total count
    const [{ count }] = await database
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(modpacks)
      .where(and(...whereConditions))

    // Get paginated data
    const data = await database.query.modpacks.findMany({
      where: and(...whereConditions),
      orderBy: orderByFn(orderByColumn),
      limit,
      offset,
      with: {
        mods: true,
      },
    })

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    }
  }
}

export const modpackRepository = new ModpackRepository()
