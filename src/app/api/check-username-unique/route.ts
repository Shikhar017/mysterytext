import dbConnect from "@/lib/dbConnect";                          
import UserModel from "@/model/User";                             
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";      

const UsernameQuerySchema = z.object({                            // creates a zod schema object
    username: usernameValidation                                  // applies username validation rules
})

export async function GET(request: Request) {                     
    await dbConnect()                                             
    try {
        const { searchParams } = new URL(request.url)       //process of taking username from params from the link        
        const queryParam = {                                      
            username: searchParams.get("username")               
        }

        const result = UsernameQuerySchema.safeParse(queryParam)  // validates queryParam against schema
        if (!result.success) {                                    
            const usernameErrors = result.error.format().username?._errors || []  //When safeParse() fails, result.error contains a ZodError object with all the validation error details.
            return Response.json({                                // .format() Converts the raw ZodError into a nested object shaped like your schema, so you can access errors by field name. 
                success: false,                                   // If the whole thing resolves to undefined or null, fallback to an empty array so the code below doesn't crash when calling .length or .join().
                message: usernameErrors?.length > 0              
                    ? usernameErrors.join(', ')                  
                    : "Invalid query parameter"                  
            }, { status: 400 })                                  
        }

        const { username } = result.data             //getting user from the validated data            
        const verifiedUser = await UserModel.findOne({           
            username,                                            
            isVerified: true                                     
        })
        if (verifiedUser) {                                      
            return Response.json({                               
                success: false,                                 
                message: "Username is already taken",            
            }, { status: 400 })                                 
        }

        return Response.json({                                  
            success: true,                                     
            message: "This username is available",               
        }, { status: 200 })                                      

    } catch (error) {
        console.error("Error checking username", error)         
        return Response.json({                                   
            success: false,                                      
            message: "Error checking username",                  
        }, { status: 500 })                                      
    }
}