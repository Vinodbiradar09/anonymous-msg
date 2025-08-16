import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions= {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",

            credentials : {
                email : {label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any) : Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or : [
                            {email : credentials?.identifier},
                            {username : credentials?.identifier} // there is some inconsitency here the identifier gets with identifier were as password can be got using credentails.password
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with this email");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password , user.password);
                    if(isPasswordValid){
                        return user;
                    } else{
                        throw new Error("Incorrect password");
                    }
                } catch (error : any) {
                    throw new Error(error);
                }
            }
        }),
    ],
     callbacks : {
        // it is important make sure to return the token for the jwt and session for the session
       async jwt({token , user}){
        if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username = user.username;
        }
        return token;
       },

       async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    },
    pages : {
        signIn : '/sign-in',
    },
    session : {
        strategy : "jwt",
    },
    secret : process.env.NEXTAUTH_SECRET,
   
}