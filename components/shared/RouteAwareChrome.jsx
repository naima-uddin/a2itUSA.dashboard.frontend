"use client";

import React from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/shared/TopBar";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function RouteAwareChrome({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const isThankYouRoute =
    pathname === "/thank-you" || pathname === "/thank-you/";

  if (isDashboardRoute || isThankYouRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
