import dbConnect from "@/lib/dbConnect";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { User } from "next-auth";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(request:Request){
    await dbConnect()
    const session=await auth()     //getting sessions so that we can get user._id
    const user:User=session?.user as User    // Type assertion to tell TypeScript that session.user is of type User, allowing us to access user properties without type errors.
    if(!session || !user){
            return Response.json({
                success:false,
                message:"Not Authenticated"
            },{status:401})
        }
        const userId=new mongoose.Types.ObjectId(user._id) // converting string id to mongoose ObjectId so that we can use it in the query
        try {
           const user=await UserModel.aggregate([
            {$match:{_id:userId}},                           
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },                           //$unwind takes a document with an array field and explodes it — one document becomes N documents, one per array element. Everything else in the parent document is copied to each new one.                     
            {$sort:{'messages.createdAt':-1}},               //sorting the messages in descending order of createdAt field, so that the latest messages come first           
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}//
           ]) 
           if(!user || user.length===0){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
           }
           return Response.json({
                success:true,
                messages:user[0].messages   //user[0] because aggregate always returns an array, and we are grouping by _id which is unique, so we will always get an array with one element, which is the user document with the messages array. So we access the messages array using user[0].messages
            },{status:200})
        } catch (error) {
            console.error("An unexpected error occured:",error)
            return Response.json({
                success:false,
                message:"Not Authenticated"
            },{status:500})
        } 
}