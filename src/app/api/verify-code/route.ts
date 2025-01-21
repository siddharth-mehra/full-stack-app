import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try{
        const {name,code}=await request.json();

        const decodeduser=decodeURIComponent(name);
        console.log(decodeduser);
        const user=await UserModel.findOne({name:decodeduser});

        if(!user){
            return Response.json({
                success:false,
                message:"User not found with this name"
            },{status:500})
        }

        const isValidCode= user.verifyCode===code;
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date();

        if(isCodeNotExpired && isValidCode){
           user.isVerified=true;
           await user.save();
           return Response.json({
               success:true,
               message:"User verified successfully"
           },{status:200})     
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification code has expired.Please signup again."
            },{status:400}) 
        }else{
            return Response.json({
                success:false,
                message:"Incorrect verification code"
            },{status:400}) 
        }
    }catch(error){
        console.error("Error verifying user:", error);
        return Response.json(
            {
                success:false,
                message:"Error verifying user"
            },{status:404}
        )
    }
}