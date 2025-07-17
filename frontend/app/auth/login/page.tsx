"use client";

import React, { useState } from "react";
import { Button, Card, CardBody, Image } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { signIn as nextSignIn } from "next-auth/react";

import { signIn } from "@/app/api/apis"; // Make sure this path matches your file structure

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

          {/* SSO buttons */}
          <div className="flex flex-col gap-4 mb-6">
            <Button
              className="w-full flex items-center gap-2"
              startContent={<FcGoogle className="text-xl" />}
              variant="bordered"
              onPress={nextSign}
            >
              Sign in with Google
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
