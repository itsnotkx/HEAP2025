import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";
import {ssoSignIn} from "@/app/api/apis";


const authOptions = {
    pages: {
        error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
},
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
//   secret: process.env.NEXTAUTH_SECRET!,

  callbacks: {
    async signIn({ user }) {
      try {
    
        const ssoResult = await ssoSignIn(user.email, user.name);
        if (ssoResult) {
            return true; 
        } else {
          return false; 
        }
      } catch (error) {
        return false;
      }
    },


    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}