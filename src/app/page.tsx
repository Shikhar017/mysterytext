"use client"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {sendMessageSchema} from "@/schemas/sendMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import Spline from "@splinetool/react-spline";


export default function Home() {

  const[isSendingMessage,setIsSendingMessage]=useState<boolean>(false)

  const form=useForm<z.infer<typeof sendMessageSchema>>({
      resolver:zodResolver(sendMessageSchema),
      defaultValues:{
        username:'',
        content:''
      }
    })

    const onSubmit=async(data:z.infer<typeof sendMessageSchema>)=>{
      setIsSendingMessage(true)
      try {
        const response=await axios.post(`/api/send-message`,{username:data.username,content:data.content})
        toast.success("Message sent",{
        description:response.data.message
      })
      setIsSendingMessage(false)
      } catch (error) {
           console.error("Error in signup of user",error)
           const axiosError=error as AxiosError<ApiError>;
           let errorMessage=axiosError.response?.data.message
           toast.error(errorMessage,{
            description:errorMessage,
           })
           setIsSendingMessage(false)
        }
      }
  return (
  <main className="relative w-full h-screen md:h-210 lg:h-260">
    {/* Robot background */}
    <Spline
      scene="https://prod.spline.design/kjygyJWqqzzC-RzD/scene.splinecode"
      className="absolute inset-0 z-0"
    />

    {/* Overlay content */}
    <div className="absolute pointer-events-none inset-0 z-10 flex flex-col lg:flex-row items-center justify-around px-4">
      
      {/* Quote Section */}
      <div className="flex flex-col items-center justify-center mb-10 lg:mb-0 lg:mr-20">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-gray-800 drop-shadow-lg">
          SHARE YOUR THOUGHTS
        </h1>
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-gray-700 drop-shadow">
          "Mystery grows with every message"
        </h1>
      </div>

      {/* Messaging UI */}
      <div className="w-full max-w-sm md:max-w-md p-6 md:p-8 rounded-xl bg-white/30 backdrop-blur-md shadow-2xl opacity-95 pointer-events-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight mb-2">
            Message Box
          </h1>
          <p className="text-sm md:text-base">
            Type your anonymous message below
          </p>
        </div>

        <form id="form-message" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username field */}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Username</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter your username"
                  autoComplete="off"
                  className="rounded-md px-4 py-2"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Message field styled like chat */}
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center space-x-2">
                  <Input
                    {...field}
                    placeholder="Write your message..."
                    autoComplete="off"
                    className="flex-1 rounded-full px-4 py-2"
                  />
                  <Button type="submit" form="form-message" className="rounded-full px-6 py-2">
                    Send
                  </Button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>
      </div>
    </div>
  </main>
);

}
