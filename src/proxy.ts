
import { NextRequest,NextResponse } from "next/server";
import {getToken} from "next-auth/jwt";

export default async function proxy(request:NextRequest){
    const token=await getToken({req:request,secret:process.env.AUTH_SECRET})
    const url=request.nextUrl

    if(token && 
        ( url.pathname.startsWith("/sign-in") ||
          url.pathname.startsWith("/sign-up") ||
          url.pathname.startsWith("/verify")  
        )){
            return NextResponse.redirect(new URL("/dashboard",request.url))
        }
    if(!token && url.pathname.startsWith("/dashboard")){
        return NextResponse.redirect(new URL("/sign-in",request.url ))
    }
}

export const config={
    matcher:[
      "/",
      "/sign-up",
      "/sign-in",
      "/dashboard/:path*",
      "/verify/:path*"
    ]
}
