import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const { error, data } = await resend.emails.send({
      from: "vinod <vinod@skmayya.me>", 
      to: email,
      subject: "Anonymous message | verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.log("ee" , email);
      console.error(" Email sending failed:", error);
      return { success: false, message: "Failed to send verification email" };
    }

    console.log("Email queued successfully:", data);
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Unexpected error while sending verification email:", emailError);
    return { success: false, message: "Unexpected error while sending verification email" };
  }
};
