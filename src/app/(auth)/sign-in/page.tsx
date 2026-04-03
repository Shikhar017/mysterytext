"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import Spline from "@splinetool/react-spline";
import { signIn } from "next-auth/react"; 
import { set } from "mongoose";


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const[isSigningIn,setIsSigningIn]=useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSigningIn(true);
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });
      console.log("signIn response:", JSON.stringify(response));
      if(response?.error){
        toast.error(response.error, {
          description: "Incorrect username or password"
        })
        setIsSigningIn(false);
      }
      if (response?.ok) {
      toast.success("Signed in successfully!")
      setIsSigningIn(false);
      router.replace("/dashboard")
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
      <div className=" flex flex-col items-center justify-center text-center md:flex mb-10 lg:mb-0 lg:mr-20">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-800 drop-shadow-lg">
          WELCOME BACK
        </h1>
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-gray-700 drop-shadow">
          "Unlock the secrets within"
        </h1>
      </div>

      {/* Sign-in Form */}
      <div className="w-full max-w-sm md:max-w-md lg:max-w-md p-6 md:p-8 rounded-xl bg-white/30 backdrop-blur-md shadow-2xl opacity-95 pointer-events-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight mb-2">
            Sign In
          </h1>
          <p className="text-sm md:text-base">
            Enter your credentials to continue
          </p>
        </div>

        <form id="form-signin" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter your username or email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
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
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          {
            isSigningIn?(<Button type="submit" form="form-signin" disabled={isSigningIn} className="w-full mt-6 h-12">
            <Loader2 className="animate-spin h-5 w-5 mr-2"/>
          </Button>):(<Button type="submit" disabled={isSigningIn} form="form-signin" className="w-full mt-6 h-12">
            Sign in
          </Button>)
          }
        </form>

        <div className="text-center mt-4">
          <p>
            Don’t have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  </main>
);
}


