import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@org/design-system/components/ui/avatar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@org/design-system/components/ui/card'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth'
import { getInitials } from '@/utils/string'

export const Route = createFileRoute('/my-profile')({
  component: MyProfilePage,
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session.data) {
      throw redirect({
        to: '/',
      })
    }
  },
})

function MyProfilePage() {
  const { data: session } = authClient.useSession()

  if (!session) {
    return null
  }

  const { user } = session

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image || ''} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-muted-foreground">{user.email}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
