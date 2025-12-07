import type { DModpack } from '@org/database/schemas'
import { Button } from '@org/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@org/design-system/components/ui/card'
import { SteamLogoIcon } from '@org/design-system/components/ui/icons'
import { Link, linkOptions } from '@tanstack/react-router'

interface ModpackCardProps {
  data: DModpack
}

export function ModpackCard({ data }: ModpackCardProps) {
  const steamLinkOptions = linkOptions({
    to: data.steamUrl ?? '',
  })

  return (
    <Button asChild>
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <CardFooter>
            <Link {...steamLinkOptions}>
              <Button>
                <SteamLogoIcon size="4.5rem" />
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </Button>
  )
}
