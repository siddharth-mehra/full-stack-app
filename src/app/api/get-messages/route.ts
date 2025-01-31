import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import mongoose from "mongoose";
export async function GET(req:Request) {
    
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }    
        
        const userId=new mongoose.Types.ObjectId(session.user._id);
        
        try{
            const user=await UserModel.aggregate([
                {$match:{_id:userId}},
                {$unwind:'$messages'},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:'$_id',messages:{$push:"$messages"}}},
            ])
            console.log(user[0].messages);
            if(!user || user.length===0){
                return new Response(JSON.stringify({ success: false, error: "User not found" }), {
                    status: 404,
                });
            }else{
                return Response.json({ success:true,messages:user[0].messages},
                    {status:200});
            }
        }catch (error) {
            console.error(error);
            return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                status: 500,
            });
        }
    } 
