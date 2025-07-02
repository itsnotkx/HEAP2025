"use client";

import React from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";

export default function SignUpPage() {
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
          <form className="flex flex-col gap-4">
            <Input
              isRequired
              label="Username"
              type="text"
              placeholder="username"
              className="w-full"
            />
            <Input
              isRequired
              label="Email"
              type="email"
              placeholder="you@example.com"
              className="w-full"
            />
            <Input
              isRequired
              label="Password"
              type="password"
              placeholder="••••••••"
              className="w-full"
            />
            <Input
              isRequired
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              className="w-full"
            />
            <Button type="submit" color="primary" className="w-full mt-4">
              Sign Up
            </Button>
          </form>
          <p className="mt-6 text-sm text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
