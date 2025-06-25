"use client";

import styles from './navbar.module.css';
import React from "react";
import { FaBookmark } from "react-icons/fa";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";



export default function Navigationbar() {

  return (
    <Navbar shouldHideOnScroll >
    <NavbarContent justify="start" >
    <NavbarBrand>
        <Button as={Link}
          href="../app/homepage"
          aria-label="logo"
          style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    }}
    >  
    <img src="/android-chrome-512x512.png" alt="Favicon" width={40} height={40} style={{marginLeft: 0, paddingLeft: 0}}/>
    </Button>
    </NavbarBrand> 
    </NavbarContent>
    {/*Code for the logo*/ }


    <NavbarContent className="hidden sm:flex gap-4 flex-1" justify="center" >
      <NavbarItem>
        <Link color="foreground" href="/home">
          Home
        </Link>
      </NavbarItem>
      <NavbarItem isActive>
        <Link color="foreground" href="/customers">
          Customers
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="warning" href="/surprise">
          Surprise Me!
        </Link>
      </NavbarItem>
    </NavbarContent>
    <NavbarContent as ="div" justify="end">
      <Button as={Link}
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
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>

            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent> 
    </Navbar>
  );
}