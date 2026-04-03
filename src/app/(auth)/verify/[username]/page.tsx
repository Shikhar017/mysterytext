"use client"

import { Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Spline from "@splinetool/react-spline";

 const verifyCode = () =>{
  const router=useRouter()
  const params=useParams<{username:string}>()
  const form=useForm<z.infer<typeof verifySchema>>({
      resolver:zodResolver(verifySchema),
      defaultValues: {
        code: "",   
      },
    })
    const onSubmit=async (data:z.infer<typeof verifySchema>)=>{
      try {
         const response=await axios.post('/api/verify-code',{
            username:params.username,code:data.code
        })
        toast.success("Success",{
            description:response.data.message
        })
        router.replace("/sign-in")
      } catch (error) {
            // console.error("Error in signup of user",error)
            const axiosError=error as AxiosError<ApiError>;
            toast.error("Verfication failed",{
            description:axiosError.response?.data.message,
            })
      }
    }
    return (
  <main className="relative w-full h-screen md:h-210 lg:h-260">
    {/* Robot background */}
    <Spline
      scene="https://prod.spline.design/kjygyJWqqzzC-RzD/scene.splinecode"
      className="absolute inset-0 z-0"
    />

    {/* Centered Verify Card */}
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
      <div className="w-full max-w-sm md:max-w-md p-6 md:p-8 rounded-xl bg-white/30 backdrop-blur-md shadow-2xl opacity-95 pointer-events-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight mb-2">
            Verify Account
          </h1>
          <p className="text-sm md:text-base">
            Enter the code sent to your email
          </p>
        </div>

        {/* Verify Form */}
        <form id="form-verify" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Verification Code</FieldLabel>
              <Input
                {...form.register("code")}
                placeholder="Enter your code"
                autoComplete="off"
                className="rounded-md px-4 py-2"
              />
            </Field>
          </FieldGroup>

          <Button type="submit" form="form-verify" className="w-full mt-6 h-12">
            Verify
          </Button>
        </form>
      </div>
    </div>
  </main>
)

}
export default verifyCode
