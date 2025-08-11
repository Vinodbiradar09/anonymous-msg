import {z} from "zod";

export const messageSchema = z.object({
    content : z.string()
    .min(5 , {message : "content must be atleast 5 characters"})
    .max(300 , {message : "content must be no longer than 300 characters"})
})

