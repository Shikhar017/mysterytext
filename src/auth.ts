import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions);