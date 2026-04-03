"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { User } from "next-auth"
import { usePathname } from "next/navigation"
import { GhostIcon, Text } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-700 
      bg-linear-to-r from-gray-900 via-black to-gray-800 
      backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
      <div className="container mx-auto flex h-16 items-center justify-between  px-15 ">

        {/* Left side */}
        <a
          href="#"
          className="text-xl flex flex-row gap-3 font-bold tracking-widest uppercase 
          text-gray-200 hover:text-gray-400 transition-colors duration-200"
        >
          <GhostIcon className="text-white"/>
          Mystery Text 
        </a>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {session ? (
            <>
              <p className="text-sm text-gray-400 tracking-wide">
                Welcome, <span className="text-gray-100 font-medium">{user.username}</span>
              </p>
              <Button
                onClick={() => signOut()}
                className="h-9 px-5 text-sm font-medium tracking-wide rounded-md 
                bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="h-9 px-5 text-sm font-medium tracking-wide rounded-md 
                bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200">
                Login
              </Button>
            </Link>
          )}

          {pathname === "/dashboard" && (
            <Link href="/">
              <Button className="h-9 px-5 text-sm font-medium tracking-wide rounded-md 
                bg-gray-200 text-black hover:bg-gray-300 transition-all duration-200">
                Home
              </Button>
            </Link>
          )}

          {session && pathname !== "/dashboard" && (
            <Link href="/dashboard">
              <Button className="h-9 px-5 text-sm font-medium tracking-wide rounded-md 
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
