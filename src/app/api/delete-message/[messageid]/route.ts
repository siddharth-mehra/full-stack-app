import  dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";


export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {
    await dbConnect();
    const messageId=params.messageid;
    const session=await getServerSession(authOptions);
    const user:User=session?.user;
    
    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Unauthorized User"
            }
            ,{status:401})
    }
    UserModel.deleteOne({id:user._id},{$pull:{messages:{_id:messageId}}})
    try{
        const foundUser=await UserModel.updateOne(
            {id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )
        if(foundUser.modifiedCount==0){
            return Response.json(
                {
                    success:false,
                    message:"User not Found"
                },{status:404} 
        ),{status:404}}

        return Response.json(
            {
                success:true,
                message:"Message deleted successfully"
            },{status:200}
        )
        
    }catch(error){
        console.log(error,`Error deleting the message`);
        return Response.json(
            {
                success:false,
                message:"Error deleting message"
            },{status:401}
        )
    }

}