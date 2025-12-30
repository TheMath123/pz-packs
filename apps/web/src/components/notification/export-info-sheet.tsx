import { Button } from '@org/design-system/components/ui/button'
import { CopyButton } from '@org/design-system/components/ui/button-copy'
import { PaperclipIcon } from '@org/design-system/components/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@org/design-system/components/ui/sheet'
import { useState } from 'react'
import { ModpackService } from '@/services/modpack'

interface ExportInfoSheetProps {
  exportId: string
  onClose?: () => void
}

export function ExportInfoSheet({ exportId, onClose }: ExportInfoSheetProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<{
    mods: string
    map: string
    workshopItems: string
  } | null>(null)

  const handleOpenChange = async (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen && onClose) {
      onClose()
    }
    if (nextOpen && !info && !loading) {
      setLoading(true)
      const result = await ModpackService.exportFileInfo(exportId)
      setInfo(result)
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="sm" className="text-xs text-blue-500">
            <PaperclipIcon className="w-4 h-4 mr-2" weight="bold" />
            View details
          </Button>
        }
      ></SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="border-b">
          <SheetTitle>Export Information</SheetTitle>
          <SheetDescription>
            Easily copy export data to share or use elsewhere.
          </SheetDescription>
        </SheetHeader>
        {loading ? (
          <ExportDataSkeletonLoading />
        ) : info ? (
          <div className="flex flex-col gap-4 p-4 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">Mods</span>
                <CopyButton variant="ghost" textToCopy={info.mods} />
              </div>
              <pre className="w-full text-xs bg-muted p-2 rounded border select-all overflow-auto max-h-40 whitespace-pre-wrap">
                <code>{info.mods}</code>
              </pre>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">Map</span>
                <CopyButton variant="ghost" textToCopy={info.map} />
              </div>
              <pre className="w-full text-xs bg-muted p-2 rounded border select-all overflow-auto max-h-40 whitespace-pre-wrap">
                <code>{info.map}</code>
              </pre>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">Workshop Items</span>
                <CopyButton variant="ghost" textToCopy={info.workshopItems} />
              </div>
              <pre className="w-full text-xs bg-muted p-2 rounded border select-all overflow-auto max-h-40 whitespace-pre-wrap">
                <code>{info.workshopItems}</code>
              </pre>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function ExportDataSkeletonLoading() {
  return (
    <div className="flex flex-col gap-4 mt-4 p-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold">Mods</span>
          <span className="h-6 w-6 bg-muted animate-pulse rounded" />
        </div>
        <div className="w-full h-12 bg-muted animate-pulse rounded border" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold">Map</span>
          <span className="h-6 w-6 bg-muted animate-pulse rounded" />
        </div>
        <div className="w-full h-8 bg-muted animate-pulse rounded border" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold">Workshop Items</span>
          <span className="h-6 w-6 bg-muted animate-pulse rounded" />
        </div>
        <div className="w-full h-12 bg-muted animate-pulse rounded border" />
      </div>
    </div>
  )
}
