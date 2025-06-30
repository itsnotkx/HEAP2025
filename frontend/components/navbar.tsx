"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  Button,
} from "@heroui/react";
import { useRouter } from 'next/navigation';

interface NavigationbarProps {
  shouldHideOnScroll?: boolean;
}

export default function Navigationbar({ shouldHideOnScroll = true }: NavigationbarProps) {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push('/login')
  }
  return (
    <Navbar
      isBordered
      className="py-1 min-h-0 h-auto fixed top-0 left-0 w-full z-50 bg-white"
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
              src="\logo.svg"
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
      <Button color="primary" className="text-white px-10 ml-40 py-2 rounded-full" size="lg" onPress={handleLoginClick}>
        Login
      </Button>
    </Navbar>
  );
}
