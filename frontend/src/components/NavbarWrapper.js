"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper({ children }) {
  const pathname = usePathname();
  // Show navbar on profile and settings pages
  const showNavbar =
    pathname.startsWith("/profile") || pathname.startsWith("/settings");

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
