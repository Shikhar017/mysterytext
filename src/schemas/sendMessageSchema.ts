import {z} from "zod"

export const sendMessageSchema=z.object({
    username:z.string().min(2).max(100),
    content:z
        .string()
        .max(300,{message:"Content should not be longer than 300 characters"})
})