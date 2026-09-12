'use client'

import { authClient } from "@/src/lib/auth-client";
import { IconDotsVertical, IconLogout, IconSettings } from "@tabler/icons-react"
import { useRouter } from 'next/navigation'
import clsx from "clsx";
import { useState } from "react"


export default function DotsOptionUser() {

    const [activeMenu, setActiveMenu] = useState<boolean>(false);
    const router = useRouter();

    const handleToogleMenuUser = ()=> {
        setActiveMenu((prev)=> !prev);
    }

    const handleSignOut = async()=> {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: ()=> {
                    router.push("/auth/signup")
                }
            }
        })
    }

  return (
    <div className="flex items-center justify-center hover:bg-red-300 cursor-pointer transition-colors duration-300 h-full rounded-r-lg">
        <button onClick={handleToogleMenuUser}>
            <IconDotsVertical />
        </button>
        <div className={clsx('absolute top-18 right-5 bg-gray-800 text-white w-50 h-20 rounded-b-lg',
            {
                'absolute': activeMenu === true,
                'hidden': activeMenu === false
            }
        )}>
            <nav className="flex flex-col items-start justify-around w-full h-full px-8">
                <li className="flex items-center gap-x-2 hover:scale-110 transition-all duration-300 w-full hover:text-gray-300">
                    <IconSettings />
                    Ajustes
                </li>
                <button 
                    className="flex items-center gap-x-2 hover:scale-110 transition-all duration-300 w-full hover:text-gray-300"
                    onClick={handleSignOut}
                >
                    <IconLogout />
                    Cerrar Sesión
                </button>
            </nav>
        </div>
    </div>
  )
}
