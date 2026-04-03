import {z} from "zod"

export const messageSchema=z.object({
    content:z
        .string()
        .max(300,{message:"Content should not be longer than 300 characters"})
})