"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/react";

import { signUp } from "../api/apis";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");

      return;
    }

    try {
      await signUp({
        username,
        email,
        password,
        image_url: null, // Optional — set to null or your logic
        preferences: undefined, // Optional — let backend default
        rating: undefined, // Optional — let backend default
      });

      router.push("/auth/login"); // Redirect to login after successful signup
    } catch (error) {
      console.error("Signup failed", error);
      setErrorMsg((error as any).detail || "Signup failed. Please try again.");
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
            Create your account
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              className="w-full"
              label="Username"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              isRequired
              className="w-full"
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
              className="w-full"
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              isRequired
              className="w-full"
              label="Confirm Password"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            <Button className="w-full mt-4" color="primary" type="submit">
              Sign Up
            </Button>
          </form>
          <p className="mt-6 text-sm text-center">
            Already have an account?{" "}
            <a className="text-blue-600 hover:underline" href="/auth/login">
              Sign in
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
