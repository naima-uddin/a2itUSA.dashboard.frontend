"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import PromotionNavbar from "@/components/shared/PromotionNavbar";

const NavbarSwitcher = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  if (pathname?.startsWith("/promotions")) {
    return <PromotionNavbar />;
  }

  return <Navbar />;
};

export default NavbarSwitcher;
