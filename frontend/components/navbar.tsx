"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import { Image } from "@heroui/react";

interface NavigationbarProps {
  shouldHideOnScroll?: boolean;
}

export default function Navigationbar({
  shouldHideOnScroll = false,
}: NavigationbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false); // wait for client-side hydration

  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const normalizedPath = (pathname ?? "/").toLowerCase().replace(/\/$/, "");
  const isRootPath = (path: string) => path === "" || path === "/";

  const handleLoginClick = () => {
    router.push("/auth/login")
  };

  const linkClass = (href: string) => {
    if (!hydrated) return "text-black font-bold hover:text-primary"; // avoid mismatches before hydration
    if (href === "/") {
      return isRootPath(normalizedPath)
        ? "text-teal-500 font-bold hover:text-primary"
        : "text-black font-bold hover:text-primary";
    }

    return normalizedPath === href.toLowerCase()
      ? "text-teal-500 font-bold hover:text-primary"
      : "text-black font-bold hover:text-primary";
  };

  return (
    <Navbar
      isBordered
      className="py-1 min-h-0 h-100 fixed top-0 left-0 w-full z-50 bg-white"
      {...(shouldHideOnScroll ? { shouldHideOnScroll: true } : {})}
    >
      <NavbarContent className="items-center px-6 w-full" justify="center">
        {/* Logo */}
        <NavbarBrand>
          <Link className="flex items-center" href="/">
            <Button
              aria-label="logo"
              as="div"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Image
                alt="Favicon"
                height={100}
                src="/logo.svg"
                style={{ marginLeft: 0, paddingLeft: 0 }}
                width={100}
              />
            </Button>
          </Link>
        </NavbarBrand>

        {/* Navigation links */}
        <nav className="flex flex-grow justify-center space-x-16 text-lg font-bold">
          <Link className={linkClass("/")} href="/">
            Features
          </Link>
          <Link className={linkClass("/aboutus")} href="/aboutUs">
            About Us
          </Link>
          <Link className={linkClass("/support")} href="/support">
            Support
          </Link>
        </nav>

        {/* Login/Avatar */}
        <div className="flex-shrink-0 w-[160px] flex justify-end">
          {status === "loading" ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : session?.user ? (
            <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
              <PopoverTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="cursor-pointer"
                  name={session.user.name || "User"}
                  size="lg"
                  src={session.user.image || "/default-avatar.png"}
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <Button
                    className="w-full text-red-500 bg-white hover:bg-gray-100"
                    onPress={() => signOut()}
                  >
                    Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              className="text-white px-10 py-2 rounded-full"
              color="primary"
              size="lg"
              onPress={handleLoginClick}
            >
              Login
            </Button>
          )}
        </div>
      </NavbarContent>
    </Navbar>
  );
}
