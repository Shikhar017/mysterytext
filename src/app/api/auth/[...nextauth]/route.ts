import NextAuth from "next-auth"
import { authOptions } from "./options"


export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions)   // NextAuth is a function that takes the authOptions object and returns an object with several properties, including handlers, auth, signIn, and signOut. We are using destructuring assignment to extract the GET and POST handlers from the handlers property, as well as the auth, signIn, and signOut functions. The GET and POST handlers will be used to handle incoming requests to this API route, while the auth function can be used to get the current user's session in other API routes or React components. The signIn and signOut functions can be used to programmatically trigger the sign-in and sign-out processes from your React components if needed.
