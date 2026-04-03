"use client"
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({ children }: { children: React.ReactNode }) { //creating a wrapper component to provide session to the entire app
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}