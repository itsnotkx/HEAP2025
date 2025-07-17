import GoogleProvider from "next-auth/providers/google";
import { ssoSignIn } from "@/app/api/apis";

// Extend the User and Token types as shown before if needed

export const authOptions = {
  pages: {
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      try {
        const ssoResult = await ssoSignIn(user.email ?? "", user.name ?? "");
        if (ssoResult) {
          user.dbUserId = ssoResult.user_id;
          user.preferences = ssoResult.preferences;
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.dbUserId = user.dbUserId;
        token.preferences = user.preferences;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.dbUserId;
      session.user.preferences = token.preferences;
      return session;
    },
  },
  // secret: process.env.NEXTAUTH_SECRET, // Uncomment if needed
};
