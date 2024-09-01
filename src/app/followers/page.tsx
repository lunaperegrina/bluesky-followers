'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { AtpAgent } from '@atproto/api'
import { useUserContext } from "@/context/userContext"

export default async function Component() {

  const { user } = useUserContext()
  return (
    <div className="w-full max-w-md mx-auto bg-background rounded-lg shadow-lg overflow-hidden mt-40">
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
      <div className="bg-primary py-6 px-8">
        <h1 className="text-3xl font-bold text-primary-foreground">Seu Perfil</h1>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-xl font-semibold">John Doe</div>
            <div className="text-muted-foreground">@johndoe</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">1.2K</div>
            <div className="text-muted-foreground">Seguidores</div>
          </div>
          <div>
            <div className="text-2xl font-bold">350</div>
            <div className="text-muted-foreground">Seguindo</div>
          </div>
          <div>
            <div className="text-2xl font-bold">42</div>
            <div className="text-muted-foreground">Não te seguem</div>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Não te seguem de volta</h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <div className="text-muted-foreground">@janedoe</div>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex items-center justify-between">
              <div className="text-muted-foreground">@bobsmith</div>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </li>
            <li className="flex items-center justify-between">
              <div className="text-muted-foreground">@sarahjones</div>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
