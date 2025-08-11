import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async(email : string , username : string , verifyCode : string): Promise<ApiResponse>=>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to : email,
            subject : "Anonymous message | verification code",
            react : VerificationEmail({username , otp : verifyCode}),
        })

        return {success : true , message : "Verification email send successfully"}
    } catch (emailError) {
        console.log("Failed to send the email verification" , emailError);
        return {success : true , message : "Failed to send verification email"}
    }
}

