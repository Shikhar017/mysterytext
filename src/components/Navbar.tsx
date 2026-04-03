"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { User } from "next-auth"
import { usePathname } from "next/navigation"
import { GhostIcon } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-700 
      bg-gradient-to-r from-gray-900 via-black to-gray-800 
      backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
      
      {/* Flex wrapper with small padding */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left side */}
        <a
          href="#"
          className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-widest uppercase 
          text-gray-200 hover:text-gray-400 transition-colors duration-200"
        >
          <GhostIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
          Mystery Text 
        </a>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          {session ? (
            <>
              <p className="hidden sm:block text-sm text-gray-400 tracking-wide">
                Welcome, <span className="text-gray-100 font-medium">{user.username}</span>
              </p>
              <Button
                onClick={() => signOut()}
                className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm font-medium tracking-wide rounded-md 
                bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm font-medium tracking-wide rounded-md 
                bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200">
                Login
              </Button>
            </Link>
          )}

          {pathname === "/dashboard" && (
            <Link href="/">
              <Button className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm font-medium tracking-wide rounded-md 
                bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200">
                Home
              </Button>
            </Link>
          )}

          {session && pathname !== "/dashboard" && (
            <Link href="/dashboard">
              <Button className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm font-medium tracking-wide rounded-md 
                bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200">
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
