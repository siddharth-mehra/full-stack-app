import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import GoogleProviders from "next-auth/providers/google";


export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any):Promise<any> {
                await dbConnect();
                try{
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials?.identifier},
                            {name:credentials?.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("User not found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify account before login")
                    }

                    const isPasswordValid=await bcrypt.compare(credentials?.password,user.password)
                    if(isPasswordValid){
                       return user 
                    }else{
                        throw new Error("Invalid password")
                    } 
                }catch(error:any){
                    throw new Error(error)
                }
            }
        }),
        GoogleProviders({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id=user._id?.toString()
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.name=user.name
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessages=token.isAcceptingMessages;
                session.user.name=token.name
            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}