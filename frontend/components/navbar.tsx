"use client";

import React from "react";
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

interface NavigationbarProps {
  shouldHideOnScroll?: boolean;
}

export default function Navigationbar({ shouldHideOnScroll = true }: NavigationbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const normalizedPath = (pathname ?? "/").toLowerCase().replace(/\/$/, "");
  const isRootPath = (path: string) => path === "" || path === "/";

  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLoginClick = () => {
    signIn(); // Use NextAuth's signIn method for popup or redirect login
  };

  const linkClass = (href: string) => {
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
      <NavbarContent justify="between" className="items-center px-6 w-full">
        {/* Logo */}
        <NavbarBrand>
          <Link href="/" passHref legacyBehavior>
            <Button
              as="a"
              aria-label="logo"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <img
                src="/logo.svg"
                alt="Favicon"
                width={100}
                height={100}
                style={{ marginLeft: 0, paddingLeft: 0 }}
              />
            </Button>
          </Link>
        </NavbarBrand>

        {/* Navigation links */}
        <nav className="flex flex-grow justify-center space-x-16 text-lg font-bold">
          <Link href="/" passHref legacyBehavior>
            <a className={linkClass("/")}>Features</a>
          </Link>
          <Link href="/aboutUs" passHref legacyBehavior>
            <a className={linkClass("/aboutus")}>About Us</a>
          </Link>
          <Link href="/support" passHref legacyBehavior>
            <a className={linkClass("/support")}>Support</a>
          </Link>
        </nav>

        {/* Login/Avatar */}
        <div className="flex-shrink-0 w-[160px] flex justify-end">
          {status === "loading" ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session?.user ? (
            <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
              <PopoverTrigger>
                <Avatar
                  isBordered
                  as="button"
                  src={session.user.image || "/default-avatar.png"}
                  name={session.user.name || "User"}
                  size="lg"
                  className="cursor-pointer"
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
              color="primary"
              className="text-white px-10 py-2 rounded-full"
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
