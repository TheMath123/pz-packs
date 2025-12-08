import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@org/design-system/components/ui/avatar'
import { Button } from '@org/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@org/design-system/components/ui/dropdown-menu'
import {
  CaretUpDownIcon,
  DiscordLogoIcon,
  MoonIcon,
  SignOutIcon,
  SunIcon,
} from '@org/design-system/components/ui/icons'
import { useTheme } from '@org/design-system/providers'
import { auth } from '@/lib/auth'
import { getInitials } from '@/utils/string'

export function NavUser() {
  const { theme, toggleTheme } = useTheme()
  const { isPending, data } = auth.useSession()
  if (isPending) return null

  if (!data) {
    return (
      <Button
        onClick={() =>
          auth.signIn.social({
            provider: 'discord',
            callbackURL: location.origin,
          })
        }
        className="gap-2"
      >
        Login <DiscordLogoIcon weight="bold" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" />}
        className="space-x-2 pl-2"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={data?.user?.image || ''}
            alt={data?.user?.name ?? ''}
          />
          <AvatarFallback>
            {data?.user?.name ? getInitials(data?.user?.name) : ''}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate ">{data?.user?.name || 'No Name'}</span>
        </div>
        <CaretUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuPositioner align="start">
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>My Profile</DropdownMenuItem>
          <DropdownMenuItem disabled>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>Github</DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === 'light' ? (
              <MoonIcon
                className="size-4.5 text-popover-foreground"
                weight="bold"
              />
            ) : (
              <SunIcon
                className="size-4.5 text-popover-foreground"
                weight="bold"
              />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => auth.signOut()}>
            <SignOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPositioner>
    </DropdownMenu>
  )
}
