"use client";
// import { signIn } from "next-auth/react";
import {ssoSignIn} from "@/app/api/apis";
import { useSession} from "next-auth/react";


import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import  {signIn}  from "@/app/api/apis"; // Make sure this path matches your file structure
import { useRouter } from "next/navigation";
import {signIn as nextSignIn} from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh

    try {
      const user = await signIn(email, password);
      console.log("Login successful", user);
      // Redirect to dashboard or homepage
      router.push("/planner");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMsg(error?.detail || "Invalid email or password");
    }
  };

  const nextSign = async () => {
    console.log("Signing in with Google...");
    try {
      const result = await nextSignIn("google", { callbackUrl: "/" });
      return result;
    } catch (error) {
      console.error("Google sign-in failed", error);
    }

  };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-6 bg-white">
        <CardBody>
          <img
            src="/logo.svg"
            alt="KiasuPlanner Logo"
            className="w-48 h-48 object-contain mx-auto mb-4"
            draggable={false}
          />
          <h1 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h1>

          {/* SSO Buttons */}
          <div className="flex flex-col gap-4 mb-6">
            <Button onPress={nextSign} variant="bordered" className="w-full flex items-center gap-2" startContent={<FcGoogle className="text-xl" />}>
              Sign in with Google
            </Button>
          </div>

          {/* Custom Divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or continue with email</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Email Login */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Email"
              type="email"
              placeholder="you@example.com"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
              label="Password"
              type="password"
              placeholder="••••••••"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            <Button type="submit" color="primary" className="w-full mt-4">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-sm text-center">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Create one
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
