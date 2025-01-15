import {resend} from "@/lib/Resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponse} from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    name:string,
    verifyCode:string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'Mess-Age <YIiD0@example.com>',
            to:email,
            subject: 'My Verification | Verify Email',
            react: VerificationEmail({name,otp:verifyCode})
        });
        return {success:true, message:"Verification email sent"}
    }catch(emailError){
        console.log("Error sending verification email",emailError)
        return {success:false, message:"Error sending verification email"}
    }
}
