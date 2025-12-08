import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback } from 'react'
import { ModpackFilters } from '@/components/modpack/filters/modpack-filters'
import { ModpackGrid } from '@/components/modpack/modpack-grid'
import { PaginationControls } from '@/components/pagination'
import { useMyModpacks } from '@/hooks/modpack'
import { CreateModpackDialog } from '@/pages/modpacks/components/create-modpack-dialog'

interface MyModpacksSearchParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export function MyModpacksPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({
    strict: false,
  }) as MyModpacksSearchParams

  const filters = {
    page: String(searchParams.page ?? 1),
    limit: String(searchParams.limit ?? 12),
    search: searchParams.search,
    sortBy: searchParams.sortBy ?? 'createdAt',
    sortOrder: searchParams.sortOrder ?? 'desc',
  }

  const { data, isLoading, error } = useMyModpacks(filters)

  const updateURL = useCallback(
    (updates: Partial<MyModpacksSearchParams>) => {
      navigate({
        search: (prev: MyModpacksSearchParams) =>
          ({ ...prev, ...updates }) as MyModpacksSearchParams,
      })
    },
    [navigate],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL({ page })
    },
    [updateURL],
  )

  const handleSearchChange = useCallback(
    (search: string) => {
      updateURL({ search: search || undefined, page: 1 })
    },
    [updateURL],
  )

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: string) => {
      updateURL({
        sortBy: sortBy as MyModpacksSearchParams['sortBy'],
        sortOrder: sortOrder as MyModpacksSearchParams['sortOrder'],
        page: 1,
      })
    },
    [updateURL],
  )

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium">
          Error loading modpacks: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Modpacks</h1>
          <p className="text-muted-foreground">
            Manage your modpacks and collaborate with others
          </p>
        </div>
        <CreateModpackDialog />
      </div>

      <div className="space-y-6">
        <ModpackFilters
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          initialSearch={filters.search}
          initialSortBy={filters.sortBy}
          initialSortOrder={filters.sortOrder}
        />

        <ModpackGrid
          modpacks={data?.data ?? []}
          isLoading={isLoading}
          emptyMessage="You don't have any modpacks yet. Create one to get started!"
        />

        {data && data.pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
