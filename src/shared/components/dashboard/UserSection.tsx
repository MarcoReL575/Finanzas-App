"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/src/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/src/shared/ui/avatar"
import { IconDotsVertical, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
    name: string;
    email: string;
}

export function UserSection({ name, email }: Props) {
    const router = useRouter()

    const handleLogOut = async()=> {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: ()=> {
                    router.push('/auth/signin')
                }
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='border border-white flex p-2 rounded-lg space-x-2 items-center'>
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarFallback className="rounded-lg uppercase">{name.slice(0,2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                        {email}
                    </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-white"
                side='bottom'
                align="end"
                sideOffset={4}
            >
                <DropdownMenuGroup>
                    <Link
                        href='/perfil'
                    >
                        <DropdownMenuItem
                            className='hover:text-blue-600 cursor-pointer hover:font-bold hover:scale-110 hover:translate-x-4 transition-all duration-300'
                        >
                            <IconUserCircle />
                            Mi perfil
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuItem
                    onClick={handleLogOut}
                    className='hover:text-red-600 cursor-pointer hover:font-bold hover:scale-110 hover:translate-x-4 transition-all duration-300'
                >
                    <IconLogout />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
