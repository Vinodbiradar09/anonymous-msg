import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 chars")
    .max(20, "Username must be less than 20 chars")
    .regex(/^(?!.*\.\.)(?!.*\.$)(?!\.)([A-Za-z0-9._]{1,30})$/ , "username must not contain special symbol and must not start or end with the dot .")

export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6 , {message : "Password must have atleast six characters"})
})





    // why zod is the mongoose schema is not enough for the checking the data 
    // zod validates the data before it reaches to mongodb
    // mongoose validation happens after the round trip of the db, means one database trip will wrong and leads to issues 
    // with zod clearly the check the data if any error then the throw the error or show it , if no error then send to the db 