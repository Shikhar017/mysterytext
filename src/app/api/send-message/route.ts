import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect()
    const {username,content}=await request.json()       //getting username and content from the request body
    const trimmedUsername = username.trim()
    console.log("Username received:", JSON.stringify(username))
    console.log("Content received:", JSON.stringify(content))
    try {
        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{status:403})
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)      //pushing the new message to the user's messages array,as Message is the type of the message object
        await user.save()
        return Response.json({
          success: true,
          message: "Message sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("Error adding messages",error)
        return Response.json({
                success:false,
                message:"Internal server error"
        },{status:500})
    }
}