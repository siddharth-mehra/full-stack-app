import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationemail";
import e from "cors";

export async function POST(request: Request) {
    await dbConnect();   
    try{
        const {name,email,password} = await request.json();
        const existingUserVerifiedbyName = await UserModel.findOne({name,isVerified:true});
        if(existingUserVerifiedbyName){
            return Response.json({success:false,message:"User already exists"},{status:400})
        }
        const verifyCode=Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserbyEmail = await UserModel.findOne({email,isVerified:true});
        if(existingUserbyEmail){
            if(existingUserbyEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"",
                },{status:500})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserbyEmail.password=hashedPassword;
                existingUserbyEmail.verifyCode=verifyCode;
                existingUserbyEmail.verifyCodeExpire=new Date(Date.now()+360000);
                await existingUserbyEmail.save();
            }
            return Response.json({success:false,message:"User already exists"},{status:400})
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate=new Date();
            expiryDate.setDate(expiryDate.getDate()+7);

            const newuser = await UserModel.create({
                name,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpire:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[], 
            });
            await newuser.save();  
        }

        // send VerificationEmail
        const emailResponse=await sendVerificationEmail(name,email,verifyCode);
        if(!emailResponse.success){
            return Response.json({success:false,message:emailResponse.message},{status:500})
        }
        return Response.json({success:true,message:"User registered successfully.Please Verify your email"},{status:200})
    }catch(error){
        console.log('Error registering user',error);
        return Response.json({success:false,message:"Error registering user"},{status:500})
    }
}