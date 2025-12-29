import type { User } from '@org/auth/types'
import { ModpackFilters } from '@/components/modpack/filters/modpack-filters'
import { PaginationControls } from '@/components/pagination'
import { TagFilter } from '@/components/tag-filter'
import { useListAllMods } from '@/hooks/mod/use-list-all-mods'
import { useFilters } from '@/hooks/use-filters'
import { authClient } from '@/lib/auth'
import { ModCard } from '@/pages/modpacks/$id/-components/mods/mod-card'
import type { ModsFiltersSchema } from '../index'
import { UpdateAllModsButton } from './update-all-mods-button'

export function ModsPage() {
  const { filters, handleSearchChange, handleSortChange, handlePageChange } =
    useFilters<ModsFiltersSchema>()

  const { data: sessionData } = authClient.useSession()
  const user = sessionData?.user as User | undefined
  const isAdmin = user?.role === 'admin'

  const { data, isLoading, error } = useListAllMods(filters)

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Error loading mods: {(error as Error).message}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">
          {data?.pagination && data?.pagination.total > 1
            ? `All Mods (${data?.pagination.total ?? 0})`
            : 'All Mods'}
        </h1>
        {isAdmin && <UpdateAllModsButton />}
      </div>

      <ModpackFilters
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        search={filters.search}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
      />

      <TagFilter />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((item) => (
            <ModCard
              key={item.id}
              data={item}
              canManage={isAdmin}
              // modpackId is optional in ModCard, if not provided, remove actions won't be shown
            />
          ))}
          {data?.data.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No mods found.
            </div>
          )}
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
