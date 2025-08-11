import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request){
    await dbConnect();

    try {
        const {username , email , password} = await request.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified : true,
        })
        if(existingVerifiedUserByUsername){
            return Response.json(
            {
                success : false,
                message : "Username is already taken",
            },
            {
            status : 400,
            }
        )
    }
    const existingUserByEmail = await UserModel.findOne({email});
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json(
                {
                    success : false,
                    message : "User already exists with this email"
                },
                {
                    status : 400
                }
            )
        } else {
            const hashedPassword = await bcrypt.hash(password , 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        }
    } else {
        const hashedPassword = await bcrypt.hash(password , 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const newUser = await UserModel.create({
            username,
            email,
            password : hashedPassword,
            verifyCode,
            verifyCodeExpiry : expiryDate,
            isVerified : false,
            isAcceptingMessages : true,
            messages : [],
        })

        if(!newUser){
            return Response.json(
                {
                    success : false,
                    message : "Failed to create user while registering",
                },
                {
                    status : 404
                }
            )
        }

    }
    const emailResponse = await sendVerificationEmail(email , username , verifyCode);
    if(!emailResponse.success){
        return Response.json(
            {
                success : false,
                message : emailResponse.message
            },
            {
                status : 500
            }
        );
    }

    return Response.json(
        {
            success : true,
            message : "User registered successfully. please verify your account",
        },
        {
            status : 201,
        }
    );

    } catch (error) {
        console.error("Error while registering the user" , error);
       return Response.json(
        {
        success : false,
        message : "Error While registering the user",
        },
        {
            status : 500,
        }
    )
    }
}