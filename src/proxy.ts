
import { NextRequest,NextResponse } from "next/server";
import {getToken} from "next-auth/jwt";

export default async function proxy(request:NextRequest){
    const token = await getToken({
     req: request,
     secret: process.env.AUTH_SECRET,
     salt: process.env.NODE_ENV === "production"
       ? "__Secure-authjs.session-token"
       : "authjs.session-token"
   })
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

export const config={    // config for the middleware,they specify the paths that the middleware should run on
    matcher:[
      "/",
      "/sign-up",
      "/sign-in",
      "/dashboard/:path*",     //
      "/verify/:path*"
    ]
}
