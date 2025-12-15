import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationService } from '@/services/notification'
import { notificationKeys } from './use-notifications'

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: NotificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() })
    },
  })
}
