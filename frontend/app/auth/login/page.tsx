"use client";

import React, { useState, FormEvent } from "react";
import { Button, Card, CardBody, Image } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { signIn as nextSignIn } from "next-auth/react";

import { signIn } from "@/app/api/apis"; // Keep your existing path

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();

  // Handle form submission with proper typing
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = await signIn(email); // Removed password since it's unused

      console.log("Login successful", user);
      router.push("/planner");
    } catch (error: any) {
      console.error("Login failed", error);
      setErrorMsg(error?.detail || "Invalid email or password");
    }
  };

  // Google SSO handler
  const handleGoogleSignIn = async () => {
    console.log("Signing in with Google...");
    try {
      await nextSignIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in failed", error);
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-6 bg-white">
        <CardBody>
          <Image
            alt="KiasuPlanner Logo"
            className="w-48 h-48 object-contain mx-auto mb-4"
            draggable={false}
            src="/logo.svg"
          />
          <h1 className="text-2xl font-bold mb-6 text-center">
            Sign in to your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 border rounded"
              aria-label="Email address"
            />
            {/* You can add a password input here if needed */}

            {errorMsg && (
              <p role="alert" className="text-red-600 text-sm mb-2">
                {errorMsg}
              </p>
            )}

            <Button type="submit" className="w-full" variant="solid">
              Sign In
            </Button>
          </form>

          <hr className="my-6 border-gray-300" />

          <Button
            className="w-full flex items-center justify-center gap-2"
            startContent={<FcGoogle className="text-xl" />}
            variant="bordered"
            onPress={handleGoogleSignIn}
            aria-label="Sign in with Google"
          >
            Sign in with Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
