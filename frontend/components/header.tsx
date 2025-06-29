import React from "react";
import UserButton from "./userButton"
import KiasuPlannerLogo from "@/components/logo";

export default function Header() {
  return (
    <header className="w-full bg-white px-4 py-2 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <KiasuPlannerLogo />
      </div>

      {/* Icons */}
      <nav className="flex items-center space-x-6">
        <div className="flex items-center space-x-6">
            <UserButton/>
        </div>
      </nav>
    </header>
  );
}
