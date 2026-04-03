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
    <main className="relative w-full h-155 md:h-250 lg:h-260">
      <Spline
        scene="https://prod.spline.design/kjygyJWqqzzC-RzD/scene.splinecode"
        className="absolute inset-0 z-0"
      />
      <div className=" z-1 opacity-80 font flex flex-col content-center items-center justify-center  h-100 w-160  absolute top-50 left-20">
         <h1 className="text-6xl font-extrabold text-shadow text-gray-800">
           TRY 
         </h1>
         <h1 className="text-6xl text-gray-800 font-extrabold text-shadow">
          THE ADVENTURE OF
         </h1>
         <h1 className="text-6xl text-gray-800 font-extrabold text-shadow">
          MYSTERY TEXT
         </h1>
        </div>
      <div className="absolute bg-white opacity-80 backdrop-blur-3xl w-105 rounded-xl top-55 right-40 z-10 text-white">       
         <div className="w-full drop-shadow-lg max-w-md p-8 space-y-8 bg-gray-100 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-5xl mt-5 font-extrabold text-gray-900 tracking-tight lg:text-5xl mb-6">
                Join Mystery Text
              </h1>
                <p className="mb-4 text-gray-900">
                  Sign up to start your anonymous adventure
                </p>
            </div>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button type="submit" form="form-rhf-demo" className="w-30 h-12 ml-32" disabled={isSubmitting}>
                {
                  isSubmitting?(
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-900" />
                      Please wait
                    </>
                  ):("Signup")
                }
              </Button>
              <div className="text-center mt-4">
                <p className="text-gray-900">
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
