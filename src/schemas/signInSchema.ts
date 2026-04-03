import {z} from "zod"

export const signInSchema=z.object({                     // this schema is for validating the data that is sent to the server when the user tries to sign in, it is not the same as the database schema, it is just for validating the data that is sent to the server
    identifier:z.string(),
    password:z.string(),
})