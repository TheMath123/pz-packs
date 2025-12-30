import {
  CheckCircleIcon,
  DownloadSimpleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from '@org/design-system/components/ui/icons'
import { cn } from '@org/design-system/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { JSX } from 'react'
import { useMarkNotificationAsRead } from '@/hooks/notification'
import { ModpackService } from '@/services/modpack'
import type { INotificationDTO } from '@/services/notification'

const icons: Record<string, JSX.Element> = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-500" weight="bold" />,
  warning: <WarningIcon className="w-5 h-5 text-yellow-500" weight="bold" />,
  error: <XCircleIcon className="w-5 h-5 text-red-500" weight="bold" />,
  default: <InfoIcon className="w-5 h-5 text-blue-500" weight="bold" />,
}

export function Notification({ data }: { data: INotificationDTO }) {
  const markAsRead = useMarkNotificationAsRead()

  const metadata = data.metadata ? JSON.parse(data.metadata) : null
  const isDownloadAction = metadata?.action === 'download-server-file'

  const handleClick = () => {
    if (!data.isRead) {
      markAsRead.mutate(data.id)
    }
  }

  const handleDownload = () => {
    if (isDownloadAction && metadata.exportId) {
      ModpackService.download(metadata.exportId)
    }
  }

  return (
    <button
      type="button"
      key={data.id}
      className={cn(
        'p-4 hover:bg-muted/50 transition-all duration-200 ease-in-out cursor-pointer',
        'flex flex-row items-start w-full gap-4 justify-between relative border-b border-border/10 dark:border-border/40',
        !data.isRead && 'bg-muted/20',
      )}
      onClick={handleClick}
    >
      <div className="ml-2">{icons[data.type] || icons.default}</div>

      <div className="flex flex-col items-start text-left gap-2 w-full">
        <h3
          className={cn(
            'text-sm font-medium leading-none flex flex-row gap-2 items-center',
            !data.isRead && 'font-bold',
          )}
        >
          {data.title}
        </h3>
        <p className="text-sm text-muted-foreground text-left leading-relaxed ">
          {data.content}
        </p>
        {isDownloadAction && (
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-blue-500 font-medium mt-1 cursor-pointer hover:bg-muted-foreground/10 py-1 px-2 rounded-md"
            onClick={handleDownload}
          >
            <DownloadSimpleIcon className="w-4 h-4" weight="bold" />
            Click to download
          </button>
        )}
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(data.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      {!data.isRead ? (
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full mt-2" />
      ) : (
        <div />
      )}
    </button>
  )
}
