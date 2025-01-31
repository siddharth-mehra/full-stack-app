import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth credentials')
}

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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
    ],
    callbacks:{
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
              const googleProfile = profile as { 
                email_verified?: boolean; 
                email?: string 
              };
              
              return !!(
                googleProfile?.email_verified && 
                googleProfile?.email?.endsWith("@gmail.com")
              );
            }
            console.log("Google Profile:", profile);
            return true;
          },
          

        async jwt({token,user}){
            if(user){
                token._id=user._id?.toString()
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.name=user.name
            }
            console.log("JWT User:", user);
            console.log("Updated Token:", token);

            return token
        },
        async session({session,token}){
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessages=token.isAcceptingMessages;
                session.user.name=token.name
            }
            console.log("Session Token:", token);
            console.log("Updated Session:", session);

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