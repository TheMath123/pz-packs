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
  GithubLogoIcon,
  LifebuoyIcon,
  MoonIcon,
  SignOutIcon,
  SunIcon,
  UserIcon,
} from '@org/design-system/components/ui/icons'
import { useTheme } from '@org/design-system/providers'
import { Link } from '@tanstack/react-router'
import { authClient } from '@/lib/auth'
import { getInitials } from '@/utils/string'

export function NavUser() {
  const { theme, toggleTheme } = useTheme()
  const { isPending, data } = authClient.useSession()
  if (isPending) return null

  console.log(data)
  if (!data) {
    return (
      <Button
        onClick={() =>
          authClient.signIn.social({
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
          <DropdownMenuItem>
            <UserIcon
              className="size-4.5 text-popover-foreground"
              weight="bold"
            />
            <Link to="/my-profile">My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifebuoyIcon
              className="size-4.5 text-popover-foreground"
              weight="bold"
            />
            <a
              href="https://discord.gg/AzGnT9yF2a"
              target="_blank"
              rel="noreferrer"
            >
              Support
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GithubLogoIcon
              className="size-4.5 text-popover-foreground"
              weight="bold"
            />
            <a
              href="https://github.com/Greens-Organization/pz-packs"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
          </DropdownMenuItem>
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
          <DropdownMenuItem
            onClick={() => authClient.signOut()}
            className="focus:bg-destructive  focus:text-accent-foreground"
          >
            <SignOutIcon
              className="focus:text-accent-foreground"
              weight="bold"
            />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPositioner>
    </DropdownMenu>
  )
}
