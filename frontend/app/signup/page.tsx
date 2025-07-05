"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { signUp } from "../_apis/apis";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
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
        image_url: null,        // Optional — set to null or your logic
        preferences: undefined, // Optional — let backend default
        rating: undefined       // Optional — let backend default
      });

      router.push("/login"); // Redirect to login after successful signup
    } catch (error) {
      console.error("Signup failed", error);
      setErrorMsg(error?.detail || "Signup failed. Please try again.");
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
          <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Username"
              type="text"
              placeholder="username"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
            <Input
              isRequired
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              className="w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            <Button type="submit" color="primary" className="w-full mt-4">
              Sign Up
            </Button>
          </form>
          <p className="mt-6 text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
