import dbConnect from "@/lib/dbConnect"
import { auth } from "@/auth"  // import { User } from "next-auth"
import UserModel from "@/model/User"
import { User } from "next-auth"

export async function DELETE(request:Request,{params}:{params:Promise<{messageid:string}>}){      //Next.js internally calls your function with two arguments — the Request object first, then a context object containing params. So if you only write one parameter, you're capturing the Request, not the context.
    const param= await params 
    const messageId=param.messageid
    await dbConnect()
    const session=await auth()                         //getting session to check if user is authenticated and to get user._id from the session token
    const user:User=session?.user as User

    if(!session || !session?.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }
    try {
        const updatedResult=await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )
        if(updatedResult.modifiedCount==0){
            return Response.json({
            success:false,
            message:"Message not found or already deleted"
        },{status:404})
        }

        return Response.json({
            success:true,
            message:"Message deleted"
        },{status:200})
    } catch (error) {
        console.error("Error deleting message",error)
        return Response.json({
            success:false,
            message:"Error deleting message"
        },{status:500})
    }
}