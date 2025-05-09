"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper({ children }) {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profile");

  return (
    <>
      {isProfilePage && <Navbar />}
      {children}
    </>
  );
}
