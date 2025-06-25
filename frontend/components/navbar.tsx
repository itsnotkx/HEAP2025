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

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = [
    {label: "Home", href: "/home"},
    {label: "Bookmarks", href:"/bookmark"},
    {label: "Suprise Me", href:"/suprise"},
    ];
    return (
    <>
    <Navbar className="navbar-blur" isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} >

      {/* Brand - always visible */}
      <NavbarContent justify="start" style={{flex: 4}}>
        <NavbarBrand>
          <p className="font-bold text-inherit">KiasuPlanner</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Hamburger menu content - always available when toggled */}


      <NavbarContent as ="div" justify="end">

        <NavbarContent >
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>

        <NavbarMenu className="dropdown-menu-clear, {styles.menu}">
        <div className={styles.menuList}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.href} className={styles.menuItem}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href={item.href}
              
            >
              {item.label}
            </Link>
          </NavbarMenuItem>

        ))}
      </div>
      </NavbarMenu>

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
  
          </>
      )
  }


  