"use client";
import { signIn } from "next-auth/react";


import React, { useState } from "react";
import { Form, Input, Button } from "@heroui/react";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (username === "admin" && password === "password") {
      alert("Login successful!");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-lg overflow-hidden min-h-[400px]">
      {/* Left half: Login form */}
      <Form
        className="flex-1 flex flex-col justify-center gap-6 p-8 z-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-2 text-center mb-4">
          <h1 className="text-2xl font-bold">Login to KiasuPlanner</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your username and password below to login to your account
          </p>
        </div>
        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          isRequired
          value={username}
          onValueChange={setUsername}
          size="lg"
          radius="lg"
          className="focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          isRequired
          value={password}
          onValueChange={setPassword}
          size="lg"
          radius="lg"
          className="focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
        {/* Forgot password link */}
        <div className="flex justify-end mb-2 -mt-4">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline text-sm font-medium transition-colors"
          >
            Forgot password?
          </a>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button type="submit" className="w-full mt-2">
          Login
        </Button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-muted-foreground">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
          {/* <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("github")}
          > */}
            {/* Sign in with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("discord")}
          >
            Sign in with Discord
          </Button> */}
        </div>
      </Form>

      {/* Right half: Logo fills whole area */}
      <div className="flex-1 bg-white relative min-h-[400px]">
        <img
          src="/logo.svg"
          alt="KiasuPlanner Logo"
          className="w-full h-full object-contain absolute inset-0"
          draggable={false}
        />
      </div>
    </div>
  );
}
