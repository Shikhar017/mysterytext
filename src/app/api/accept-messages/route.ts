import { auth } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function POST(request:Request){
    await dbConnect()
    const session=await auth()                         //getting session to check if user is authenticated and to get user._id from the session token
    const user:User=session?.user as User              // Type assertion to tell TypeScript that session.user is of type User, allowing us to access user properties without type errors.

    if(!session || !user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId=new mongoose.Types.ObjectId(user._id)         // converting string id to mongoose ObjectId so that we can use it in the query
    const {acceptMessages}=await request.json()

    try{
      const updatedUser=await UserModel.findOneAndUpdate(
        {_id:userId},
        {isAcceptingMessage:acceptMessages},
        {new:true}
        )

      if(!updatedUser){
        return Response.json({
            success:false,
            message:"failed to update user status to accept messages"
        },{status:401})
      }

      return Response.json({
            success:true,
            message:"Message accepting status changes successfully"
        },{status:200})

  } catch (error) {
    console.error("Failed to update user status to accept messages")
    
    return Response.json({
        success:false,
        message:"Failed to update user status to accept messages"
    },{status:401})
  }
}

export async function GET(request:Request){
    await dbConnect()

    const session=await auth()   //getting session to check if user is authenticated and to get user._id from the session token
    const user:User=session?.user as User      // Type assertion to tell TypeScript that session.user is of type User, allowing us to access user properties without type errors.

    if(!session || !user){
        return Response.json({
            success:false,
            message:"Not Authorized"
        },{status:401})
    }
    const userId=new mongoose.Types.ObjectId(user._id)      // converting string id to mongoose ObjectId so that we can use it in the query

    try {
        const foundUser=await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
    
        return Response.json({
                success:true,
                isAcceptingMessages:foundUser.isAcceptingMessage       // returning the current status of whether the user is accepting messages or not, so that the frontend can display it accordingly when the user visits the settings page.
            },{status:200})
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error updating user accepting message status"
        },{status:500})
    }
}