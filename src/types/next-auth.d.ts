import "next-auth"
import { DefaultSession } from "next-auth"


declare module "next-auth"{   // to add custom properties to the user object in session and jwt
    interface User{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
    interface Session{
      user:{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
      }& DefaultSession["user"]  // to include the default properties of the user object in session like name, email, image
    }
}

declare module "next-auth/jwt"{
        interface JWT{
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string;
        }
    }