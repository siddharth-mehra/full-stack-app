import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";
export async function GET(req:Request) {
    
        await dbConnect();
        const session = await getServerSession(authOptions);
        const user:User=session?.user;
        if (!session || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }    
        
        const userId=new mongoose.Types.ObjectId(user._id);
        try{
            const user=await UserModel.aggregate([
                {$match:{id:userId}},
                {$unwind:"$messages"},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:"$id",messages:{$push:"$messages"}}},
            ])

            if(!user || user.length===0){
                return new Response(JSON.stringify({ success: false, error: "User not found" }), {
                    status: 404,
                });
            }else{
                return new Response(JSON.stringify({ success:true,messages:user[0].messages }), {
                    status: 200,
                });

            }
        }catch (error) {
            console.error(error);
            return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                status: 500,
            });
        }
    } 
