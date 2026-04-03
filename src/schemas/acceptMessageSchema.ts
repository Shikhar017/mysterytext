import {z} from "zod"     //These schemas ensure that only properly formatted data is processed on the server—they validate data sent from the frontend before it's used in business logic or saved to the database.

export const acceptMessageSchema=z.object({    // this schema is for validating the data that is sent to the server when the user tries to accept a message, it is not the same as the database schema, it is just for validating the data that is sent to the server
    acceptMessages:z.boolean()                 
})