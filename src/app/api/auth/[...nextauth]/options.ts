import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs" 
import UserModel from "@/model/User" 
import dbConnect from "@/lib/dbConnect" 
import Credentials from "next-auth/providers/credentials"

export const authOptions:NextAuthConfig=({           // Exporting the full NextAuth configuration
  providers: [                                  // Array of login methods
    Credentials({                       // Setting up email + password login
      id: "credentials",                        // Unique ID for this provider
      name: "Credentials",                      // Display name shown on login UI
      credentials: {
        email: { label: "Email", type: "text" },               // Email input field
        password: { label: "Password", type: "password" }      // Password input field
      },
      async authorize(credentials: any): Promise<any> {       // Runs on every login attempt
        await dbConnect()                                     // Connect to DB before querying
        try {
          const user = await UserModel.findOne({             // Search for user in DB
            $or: [
              { email: credentials.identifier },            // Match by email
              { username: credentials.identifier },         // OR match by username
            ]
          })
          if (!user) { 
            throw new Error("No user found with this credential") 
          }
          if (!user?.isVerified) { 
            throw new Error("Please verify your account before logging in") 
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password) 
          if (!isPasswordCorrect) { 
            throw new Error("The password is wrong") 
          }
          return user 
        } catch (error: any) {
          throw new Error(error) 
        }
      }
    })
  ],
  callbacks: {                               // callbacks are hook functions that run automatically at specific points during the auth flow, letting you customize what data gets stored in the token and session.
    async jwt({ token, user }) {             //Created on the server after login,Stored in a cookie in the browser,Sent automatically with every request to verify the user
      if (user) {
        token._id = user._id?.toString()            
        token.isVerified = user.isVerified         
        token.isAcceptingMessages = user.isAcceptingMessages 
        token.username = user.username             
      }
      return token // Return updated token
    },
    async session({ session, token }) {         //Created from the token on the server,Made available to your React components via useSession(),Easier to read and use than raw JWT
      if (token) { 
        session.user._id = token._id 
        session.user.isVerified = token.isVerified 
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username = token.username 
      }
      return session 
    },
  },
  pages: {
    signIn: "/sign-in"                                      // It tells NextAuth **where your custom pages are** instead of using the default ones.
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET, // It is a **secret key** that NextAuth uses to **encrypt and sign** the JWT token so nobody can tamper with it.
})
export { GET, POST } from "@/auth";

