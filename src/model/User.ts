import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{  //we need to define the message as we are using typescript and we need to tell it what the message looks like
   content:string;
   createdAt:Date
}

const MessageSchema:Schema<Message>=new Schema({  //this is the schema for typescript
     content:{
        type:String,
        required:true
     },
     createdAt:{
        type:Date,
        required:true,
        default:Date.now
     }
})

export interface User extends Document{
   username:string;
   email:string;
   password:string;
   verifyCode:string;
   verifyCodeExpiry:Date;
   isVerified:boolean;
   isAcceptingMessage:boolean;
   messages:Message[]
}

const UserSchema:Schema<User>=new Schema({
     username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
     },
     email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please provide a valid email address"]
      },
      password:{
         type:String,
         required:[true,"password is required"],
      },
      verifyCode:{
         type:String,
         required:[true,"verify code is required"]
      },
      verifyCodeExpiry:{
         type:Date,
         required:[true,"expiry code date is required"]
      },
      isVerified:{
         type:Boolean,
         default:false
      },
      isAcceptingMessage:{
         type:Boolean,
         default:true
      },
      messages:[MessageSchema]
})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)  //this is to prevent the model from being redefined when we use it in other files, as mongoose will throw an error if we try to redefine a model that already exists, so we check if the model already exists and if it does we use it, otherwise we create a new one

export default UserModel;