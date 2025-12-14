import { ModpackFilters } from '@/components/modpack/filters/modpack-filters'
import { PaginationControls } from '@/components/pagination'
import { useListModpackMods } from '@/hooks/modpack/mod/use-list-modpack-mods'
import { useImportModpackStatus } from '@/hooks/modpack/use-import-modpack-status'
import { useFilters } from '@/hooks/use-filters'
import type { ModsFiltersSchema } from '../../index'
import { AddModDialog } from '../add-mod/add-mod-dialog'
import { ImportModpackDialog } from '../import-modpack/import-modpack-dialog'
import { ModCard } from './mod-card'

interface ModsListProps {
  modpackId: string
  canManage: boolean
}

export function ModsList({ modpackId, canManage }: ModsListProps) {
  const { filters, handleSearchChange, handleSortChange, handlePageChange } =
    useFilters<ModsFiltersSchema>()

  const { data, isLoading, error } = useListModpackMods(filters, modpackId)
  const { data: importStatus } = useImportModpackStatus(modpackId)

  const isImporting =
    importStatus?.status === 'active' ||
    importStatus?.status === 'waiting' ||
    importStatus?.status === 'delayed'

  if (error) {
    return (
      <div className="text-red-500">
        Error loading mods: {(error as Error).message}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold">
          {data?.pagination && data?.pagination.total > 1
            ? `Mods (${data?.pagination.total ?? 0})`
            : 'Mods'}
        </h2>
        {canManage && (
          <div className="flex gap-2 items-center">
            {isImporting ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground border border-border">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Importing mods from Steam...
              </div>
            ) : (
              <>
                <ImportModpackDialog modpackId={modpackId} />
                <AddModDialog modpackId={modpackId} />
              </>
            )}
          </div>
        )}
      </div>

      <ModpackFilters
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        search={filters.search}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
      />

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
              canManage={canManage}
              modpackId={modpackId}
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
