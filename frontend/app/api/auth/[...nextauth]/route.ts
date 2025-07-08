import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async redirect({ url, baseUrl }) {
//         console.log(baseUrl);       
//         return  baseUrl + "/home"
//     },
//     async session({ session, token }) {
//       // Add custom session data here
//       session.user.id = token.sub;
//       return session;
//     },
//   }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}

// export default NextAuth(authOptions);