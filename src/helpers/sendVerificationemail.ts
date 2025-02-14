import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponse} from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    name:string,
    verifyCode:string
): Promise<ApiResponse> {
    try{
        const response=await resend.emails.send({
            from: 'sidhu15.mehra@gmail.com',
            to:email,
            subject: 'My Verification | Verify Email',
            react: VerificationEmail({name,otp:verifyCode})
        });
        console.log("Email send response",response)
        return {success:true, message:"Verification email sent"}
    }catch(emailError){
        console.log("Error sending verification email",emailError)
        return {success:false, message:"Error sending verification email"}
    }
}
