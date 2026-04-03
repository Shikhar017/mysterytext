"use client"

import { Button } from "@/components/ui/button"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { User } from "next-auth" 
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"
import Spline from "@splinetool/react-spline"

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session,status } = useSession()
  const user: User = session?.user as User

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue("acceptMessages", response.data.isAcceptingMessages ?? true)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error setting message acceptance", {
        description: axiosError.response?.data.message,
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Refreshed Messages", {
          description: "Showing latest messages",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {
        description: axiosError.response?.data.message,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      })
      setValue("acceptMessages", !acceptMessages)
      toast.success(response?.data.message, {
        description: response?.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error switching message acceptance", {
        description: axiosError.response?.data.message,
      })
    }
  }
  const baseUrl = typeof window !== 'undefined'    //window is only defined in the browser, not on the server. So this check ensures we don't try to access window when rendering on the server, which would cause an error. If window is undefined (i.e., we're on the server), we set baseUrl to an empty string to avoid errors. If window is defined (i.e., we're in the browser), we construct the baseUrl using the current protocol and host.
    ? `${window.location.protocol}//${window.location.host}`
    : ''
  const profileUrl = `${baseUrl}/${user?.username}`

  const copyToClipboard=()=>{
    navigator.clipboard.writeText(profileUrl)
    toast.success("URL copied",{
        description:"Profile URL has been copied to clipboard"
      })
  }
  if (status === "loading") {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
    </div>
  )
}

  if (!session || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg font-medium">Please login to continue</p>
      </div>
    )
  }

  return (
  <main className="relative w-full h-screen md:h-210 lg:h-260">
    {/* Robot background */}
    <Spline
      scene="https://prod.spline.design/kjygyJWqqzzC-RzD/scene.splinecode"
      className="absolute inset-0 z-0"
    />

    {/* Centered Dashboard */}
    <div className="absolute inset-0 z-10 flex items-center pointer-events-none justify-center px-4">
      <div className="w-full max-w-5xl p-6 md:p-8 rounded-xl bg-white/30 backdrop-blur-md shadow-2xl opacity-95 pointer-events-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-900 mt-1">
            Welcome <span className="text-gray-900 font-semibold">{user?.username}</span>
          </p>
        </div>

        {/* Profile Link Card */}
        <div className="bg-white/40 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your Public Link
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 truncate"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(profileUrl)
                toast.success("URL copied", {
                  description: "Profile URL has been copied to clipboard",
                })
              }}
              className="shrink-0"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Card */}
        <div className="bg-white/40 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Accept Messages</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {acceptMessages
                  ? "You are currently accepting messages"
                  : "You are not accepting messages"}
              </p>
            </div>
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Messages Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Messages
            {messages.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({messages.length})
              </span>
            )}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              fetchMessages(true)
            }}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={(id) =>
                  setMessages(messages.filter((m) => m._id.toString() !== id))
                }
              />
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-900 text-md">No messages yet.</p>
              <p className="text-gray-900 text-sm mt-1">
                Share your link to start receiving messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </main>
)

}
