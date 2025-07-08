"use client";
import { AiOutlineWarning } from "react-icons/ai";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <AiOutlineWarning className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Login Unsuccessful</h1>
        <p className="text-gray-600 mb-6 text-center">
          Sorry, we couldn't log you in.<br />
          Please try again or contact support if the problem persists.
        </p>
        
        <Link href="/auth/login" passHref>
          <Button color="primary" className="w-full">
            Try Again
          </Button>
        </Link>
      </div>
    </div>
  );
}