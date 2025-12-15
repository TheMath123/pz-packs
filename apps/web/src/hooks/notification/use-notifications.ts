import { useQuery } from '@tanstack/react-query'
import { NotificationService } from '@/services/notification'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: NotificationService.list,
    refetchInterval: 10000, // Poll every 10 seconds
  })
}
