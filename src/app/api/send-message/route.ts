import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const {name,content}=await request.json();
    try{
        const user=await UserModel.findOne({name});
        if(!user){
            return Response.json({success:false, message:"User not found"},{status:400});
        }
        // is user accepting the messages
        if(!user.isAcceptingMessages){
            return Response.json({success:false, message:"User is not accepting messages"},{status:400});
        }
        const newMessage={content:content, createdAt:new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({success:true, message:"Message sent successfully"},{status:200});
    }catch(error){
        return Response.json({success:false, message:"Error sending message"},
            {status:401});   
    }
}

