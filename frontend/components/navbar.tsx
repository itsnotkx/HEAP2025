"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  Button,
  Avatar,
} from "@heroui/react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; // Replace with your auth hook if not NextAuth

interface NavigationbarProps {
  shouldHideOnScroll?: boolean;
}

export default function Navigationbar({ shouldHideOnScroll = true }: NavigationbarProps) {
  const router = useRouter();

  // Get auth state (replace this with your own auth hook if needed)
//   const { data: session, status } = useSession();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleProfileClick = () => {
    // if (session?.user?.id) {
    //   router.push(`/users/${session.user.id}`);
    // }
  };

  return (
    <Navbar 
      isBordered
      className="py-1 min-h-0 h-100 fixed top-0 left-0 w-full z-50 bg-white"
      {...(shouldHideOnScroll ? { shouldHideOnScroll: true } : {})}
    >
      <NavbarContent justify="start" className="items-start mt-6">
        <NavbarBrand>
          <Button
            as={Link}
            href="../"
            aria-label="logo"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img
              src="/logo.svg"
              alt="Favicon"
              width={100}
              height={100}
              style={{ marginLeft: 0, paddingLeft: 0 }}
            />
          </Button>
        </NavbarBrand>
      </NavbarContent>

      <nav className="flex space-x-40 text-lg font-semibold">
        <a href="#" className="hover:text-primary">Features</a>
        <a href="/aboutUs" className="hover:text-primary">About Us</a>
        <a href="#" className="hover:text-primary">Support</a>
      </nav>

      <div className="ml-40">
        {status === "loading" ? (
          // Show nothing or a skeleton while loading session
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        )
        //  : session?.user ? (
        //   // User is logged in → show avatar
        //   <Avatar
        //     isBordered
        //     as="button"
        //     src={session.user.image || "/default-avatar.png"}
        //     name={session.user.name || "User"}
        //     size="lg"
        //     className="cursor-pointer"
        //     onClick={handleProfileClick}
        //   />
        // ) 
        : (
          // User not logged in → show login button
          <Button
            color="primary"
            className="text-white px-10 py-2 rounded-full"
            size="lg"
            onPress={handleLoginClick}
          >
            Login
          </Button>
        )}
      </div>
    </Navbar>
  );
}
