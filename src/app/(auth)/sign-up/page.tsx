"use client"
    import {zodResolver} from "@hookform/resolvers/zod";
    import Spline from '@splinetool/react-spline';
    import {Controller, useForm} from "react-hook-form";
    import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
    import * as z from "zod";
    import { Loader2, Eye, EyeOff } from "lucide-react";
    import Link from "next/link";
    import { useDebounceCallback} from 'usehooks-ts'
    import { useEffect, useState } from "react";
    import { toast } from "sonner"
    import { useRouter } from "next/navigation";
    import { signUpSchema } from "@/schemas/signUpSchema";
    import axios, { AxiosError } from "axios"
    import { ApiResponse } from "@/types/ApiResponse";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";


export default function Home() {
  const[username,setUsername]=useState('')
        const[showPassword, setShowPassword] = useState(false)
        const[usernameMessage,setUsernameMessage]=useState('')
        const[isCheckingUsername,setIsCheckingUsername]=useState(false)
        const[isSubmitting,setIsSubmitting]=useState(false)
        const debounced=useDebounceCallback(setUsername,500)
        const router=useRouter()
  
        //zod implementation
        const form=useForm<z.infer<typeof signUpSchema>>({
          resolver:zodResolver(signUpSchema),
          defaultValues:{
            username:'',
            email:'',
            password:''
          }
        })
  
        useEffect(()=>{
          const checkUsernameUnique=async()=>{
            if(username){
              setIsCheckingUsername(true)
              setUsernameMessage('')
              try {
                const response=await axios.get(`/api/check-username-unique?username=${username}`)
                setUsernameMessage(response.data.message) 
              } catch (error) {
                const axiosError=error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
            }finally{
              setIsCheckingUsername(false)
            }
          }
        }
        checkUsernameUnique()
      },[username])
  
        const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
          setIsSubmitting(true)
          try {
            const response=await axios.post<ApiResponse>('/api/sign-up',data)
            toast.success("Success",{
              description:response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
          } catch (error) {
            console.error("Error in signup of user",error)
            const axiosError=error as AxiosError<ApiResponse>;
            let errorMessage=axiosError.response?.data.message
            toast.error("SignUp failed",{
              description:errorMessage,
            })
            setIsSubmitting(false)
          }
        }
  return (
    <main className="relative w-full h-screen md:h-210 lg:h-260">
  <Spline
    scene="https://prod.spline.design/kjygyJWqqzzC-RzD/scene.splinecode"
    className="absolute inset-0 z-0"
  />

  <div className="absolute inset-0 z-10 flex flex-col lg:flex-row items-center justify-around pointer-events-none px-4">
    {/* Tagline Section */}
    <div className="flex flex-col items-center justify-center mb-10 lg:mb-0 lg:mr-20 pointer-events-none">
      <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-gray-800 drop-shadow-lg">
        TRY THE
      </h1>
      <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-gray-800 drop-shadow-lg">
         ADVENTURE OF
      </h1>
      <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-gray-800 drop-shadow-lg">
        MYSTERY TEXT
      </h1>
    </div>

    {/* Form Section */}
    <div className="w-full  max-w-md lg:max-w-lg p-6 md:p-8 rounded-xl bg-white/30 backdrop-blur-md shadow-2xl opacity-90 pointer-events-auto">
      <div className="text-center  mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight mb-2">
          Join Mystery Text
        </h1>
        <p className="text-sm md:text-base">
          Sign up to start your anonymous adventure
        </p>
      </div>

      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-gray-900 " htmlFor="form-rhf-demo-title">
                        Username
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        className="bg-blue-100"
                        placeholder="Enter your username"
                        autoComplete="off"
                        onChange={(e)=>{
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                      {
                        isCheckingUsername && <Loader2 className="animate-spin"/>
                      }
                      {usernameMessage=="This username is available"?(<p className="text-green-500">{usernameMessage} </p>):(<p className="text-red-500">{usernameMessage} </p>)}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-gray-900" htmlFor="form-rhf-demo-title">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        className="bg-blue-100"
                        placeholder="Enter your email"
                        autoComplete="off"                 
                        />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-gray-900" htmlFor="form-rhf-demo-title">
                  Password
                </FieldLabel>
                <div className="relative">
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  className="bg-blue-100"
                  type={showPassword ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  autoComplete="off"
                />
              <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
              )}
                </Field>
              )}
              />
              </FieldGroup>
      </form>

      <Button
        type="submit"
        form="form-rhf-demo"
        className="w-full mt-6 h-12"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Signup"
        )}
      </Button>

      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
</main>

  );
}
