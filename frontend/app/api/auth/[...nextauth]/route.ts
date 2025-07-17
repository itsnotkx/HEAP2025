import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { ssoSignIn } from "@/app/api/apis";

const authOptions = {
  pages: {
    error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  //   secret: process.env.NEXTAUTH_SECRET!,

  callbacks: {
    async signIn({ user }) {
      try {
        const ssoResult = await ssoSignIn(user.email, user.name);

        if (ssoResult) {
          console.log(ssoResult);
          user.dbUserId = ssoResult.user_id;
          user.preferences = ssoResult.preferences;

          // console.log(user.dbUserId)
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },

    async jwt({ token, user }) {
      // When user signs in, store the SSO user_id in the token
      if (user) {
        token.dbUserId = user.dbUserId;
        token.preferences = user.preferences;
      }

      // console.log(token.preferences)
      return token;
    },

    async session({ session, token }) {
      // Pass the SSO user_id from token to session
      session.user.id = token.dbUserId;
      session.user.preferences = token.preferences;

      // console.log(session.user.preferences)
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
