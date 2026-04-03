"use client"

import axios from "axios"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle } from "./ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Message } from "@/model/User"
import { Dot, X } from "lucide-react"

export default function MessageCard({
  message,
  onMessageDelete,
}: {
  message: Message
  onMessageDelete: (messageId: string) => void
}) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`)
      toast.success("Message deleted", {
        description: response.data.message,
      })
      onMessageDelete(message._id.toString())
    } catch (error: any) {
      toast.error("Error deleting message", {
        description: error.response?.data?.message ?? "Unknown error",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <CardTitle className="flex flex-col">
          <h2 className="flex items-center font-semibold text-gray-900">
            <Dot className="text-blue-500 mr-1" />
            {message.content}
          </h2>
          <p className="text-xs text-gray-500 ml-5">
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-7 h-7 p-0 flex items-center justify-center rounded-full hover:bg-red-100"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This message will be permanently deleted and cannot be
                recovered. Please confirm you want to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  )
}
