import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"; 
import { usernameValidation } from "@/schemas/signUpSchema";

// to get any value from the query ,
// localhost:3000/api/check-username-unique?username=vinod?phone=5555
// here we need to extract the username value which is vinod we do it by , 
// const {searchParams} = new URL(request.url) , const queryParam = {username : searchParams.get('username)}

const  UsernameQuerySchema = z.object({
    username : usernameValidation,
});

export async function GET(request : Request) {
   
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username : searchParams.get('username')
        };
        const result = UsernameQuerySchema.safeParse(queryParams);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success : false,
                message : usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters",
            }, {status : 400});
        }
        console.log("result" , result);
        const {username} = result.data; // here we are extracting the username value from the zod's result

        const existingVerifiedUser = await UserModel.findOne({username , isVerified : true});
        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "Username is already taken"
            },
        {
            status : 200
        })
        }

        return Response.json(
            {
                success : true,
                message : "Username is unique",
            },
            {
                status : 200
            }
        )
    } catch (error) {
        console.error("Error while checking the username" , error);
        return Response.json(
            {
                success : false,
                message : "Error checking Username",
            },
            {
                status : 500
            }
        ); 
    }
}