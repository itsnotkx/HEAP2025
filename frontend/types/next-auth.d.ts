// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;               // add id from your backend
      preferences?: Record<string, any>; // user preferences if any
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    preferences?: Record<string, any>;
  }
}
