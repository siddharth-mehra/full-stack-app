import mongoose,{Schema,Document} from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified: boolean;
    isAcceptingMessages:boolean;
    messages:Message[]
}

export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageScehma = new Schema<Message>({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const UserSchema : Schema<User>=new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Username is required"],
        trim:true,
        unique:true
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        //  writing a regix for basic validation
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true,"Verification code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,"Verification code expire is required"],
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    isAcceptingMessages: {
        type: Boolean,
        required: true,
    },
    messages:[MessageScehma]
});


// next js run on edge case so it doesnt know it 
// is running firsttime or not so we need to use the nextjs model 

const UserModel =( mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema)
export default UserModel;