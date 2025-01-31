import {z} from "zod"
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { nameValidation } from "@/schemas/signupSchema";

 const nameQuerySchema=z.object({
    name:nameValidation    
 })

 export async function GET(request: Request) {  
    await dbConnect();
    try{
        const {searchParams}=new URL(request.url);
        const queryParam={
            name:searchParams.get('name')
        }
        // validate with zod
        const result=nameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameError=result.error.format().
            name?._errors || [];      
            return Response.json(
                {
                    success:false,
                    message:usernameError
                },{status:400}
            )
        }

        const {name}=result.data;
        const existingVerifiedUserByUsername=await UserModel.findOne({name,isVerified:true});
        if(existingVerifiedUserByUsername){
            return Response.json(
                {
                    success:false,
                    message:'Username is already taken'
                }
            )
        }else{
            return Response.json(
                {
                    success:true,
                    message:'Username is available'
                }
            )
        }
    }catch(error){
        console.error("Error checking username:", error);
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            }
        )
    }
 }