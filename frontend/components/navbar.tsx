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
        <a href="#" className="hover:text-primary">About Us</a>
        <a href="#" className="hover:text-primary">Support</a>
      </nav>
      <Button color="primary" className="text-white px-10 ml-40 py-2 rounded-full" size="lg" onPress={handleLoginClick}>
        Login
      </Button>

      {/* <NavbarContent className="hidden sm:flex gap-4 flex-1 items-start mt-8" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/home" className="text-base leading-tight py-0 my-0">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link color="foreground" href="/customers" className="text-base leading-tight py-0 my-0">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="warning" href="/surprise" className="text-base leading-tight py-0 my-0">
            Surprise Me!
          </Link>
        </NavbarItem>
      </NavbarContent> */}

      {/* <NavbarContent as="div" justify="end" className="items-start mt-6">
        <Button
          as={Link}
          href="../app/bookmarks"
          aria-label="Bookmark"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <FaBookmark className="w-6 h-6" />
        </Button>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile">
              <p className="font-semibold">Account</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent> */}
    </Navbar>
  );
}
