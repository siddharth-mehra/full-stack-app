import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={};
async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("already connected");
        return;
    }
    try{
       const db= await mongoose.connect(process.env.MONGODB_URI as string || "",{});
        console.log(db);
        connection.isConnected=db.connections[0].readyState

        console.log("db connected successfully",db.connections[0])
    }catch(error){
        console.log(error,"Database connection failed");
        process.exit(1);
    }
}

export default dbConnect;