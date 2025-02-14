import { NextAuthOptions } from "next-auth";
// import { Account,Profile as NextAuthProfile } from "next-auth";
// Ensure this path matches your db connection
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Types } from "mongoose";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth credentials");
}
if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET in environment variables");
}

interface dbUser {
    _id: Types.ObjectId;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    name: string;
}



export const authOptions: NextAuthOptions = {
    // ✅ Adding MongoDB Adapter
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.identifier }, // Ensure correct field name
                            { name: credentials?.identifier }
                        ]
                    });

                    if (!user) throw new Error("User not found with this email");
                    if (!user.isVerified) throw new Error("Please verify your account before login");

                    const isPasswordValid = await bcrypt.compare(credentials?.password, user.password);
                    if (!isPasswordValid) throw new Error("Invalid password");

                    return user;
                } catch (error: any) {
                    throw new Error(error.message || "An authentication error occurred");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                if (!profile || !profile.email) {
                    return false;
                }
              // Connect to DB and check for an existing user with this email
              await dbConnect();
              const existingUser = await UserModel.findOne({ email: profile?.email });
              // Deny sign in if no user exists with this email
              if (!existingUser) {
                return false;
              }
              if(profile.name !== existingUser.name){
                profile.name = existingUser.name
              }
              existingUser.isVerified=true;
              
              await existingUser.save();
              // Optionally, you can also check if the user is verified:
              return true;
            }
            // For other providers, allow sign in
            return true;
          },
          
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email; // Store email in the token
            }else if (token.email) {
                // ✅ If `user` is not available (e.g., for subsequent requests), fetch from DB
                await dbConnect();
                const dbUser = await UserModel.findOne({ email: token.email }) as dbUser;
                if (dbUser && dbUser._id) {
                    token._id = dbUser._id.toString();
                    token.isVerified = dbUser.isVerified;
                    token.isAcceptingMessages = dbUser.isAcceptingMessages;
                    token.name = dbUser.name;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user, // Avoid mutation issues
                    _id: token._id || "",
                    isVerified: token.isVerified,
                    isAcceptingMessages: token.isAcceptingMessages,
                    name: token.name,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};


