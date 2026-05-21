"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  Menu,
  X,
  FileText,
  Settings,
  Users,
  ShoppingCart,
  Image,
  ChevronDown,
  TrendingUp,
  FileTextIcon,
} from "lucide-react";
import Link from "next/link";

const DashboardNavLink = ({ item, pathname, onClick }) => {
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive
          ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{item.label}</span>
    </Link>
  );
};

const PromotionalGroup = ({ item, pathname, onCloseMobile }) => {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-700 hover:bg-slate-100`}
      >
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
        <ChevronDown
          className={`w-4 h-4 ml-auto transition-transform ${open ? "-rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2 space-y-1 pl-8">
          {item.children.map((child) => (
            <DashboardNavLink
              key={child.id}
              item={child}
              pathname={pathname}
              onClick={() => {
                onCloseMobile();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const sidebarRef = useRef(null);

  const menuItems = [
    // {
    //   id: "services",
    //   label: "Manage Services",
    //   icon: ShoppingCart,
    //   href: "/dashboard/services",
    // },

    {
      id: "regular",
      label: "Regular",
      icon: FileText,
      href: "#",
      children: [
        {
          id: "portfolio",
          label: "Manage Portfolio",
          icon: Image,
          href: "/dashboard/portfolio",
        },
        {
          id: "blog",
          label: "Manage Blog",
          icon: FileText,
          href: "/dashboard/blog",
        },
        //a@IT LLC er jonne dorkar nei
        // {
        //   id: "employees",
        //   label: "Manage Employees",
        //   icon: Users,
        //   href: "/dashboard/employees",
        // },
        // {
        //   id: "services",
        //   label: "Manage Services",
        //   icon: ShoppingCart,
        //   href: "/dashboard/services",
        // },
        // {
        //   id: "categories",
        //   label: "Manage or Update the catgoriers",
        //   icon: FileTextIcon,
        //   href: "/dashboard/categories",
        // },
        {
          id: "pricing",
          label: "Manage Pricing",
          icon: ShoppingCart,
          href: "/dashboard/pricing",
        },
      ],
    },

    {
      id: "promotional",
      label: "Promotional",
      icon: TrendingUp,
      href: "#",
      children: [
        {
          id: "promotion-pages",
          label: "Promotion Pages",
          icon: FileText,
          href: "/dashboard/promotions",
        },
      ],
    },
    {
      id: "media",
      label: "All Media",
      icon: Image,
      href: "/dashboard/media",
    },
    ...(user?.role === "admin"
      ? [
          {
            id: "users",
            label: "Manage Users",
            icon: Users,
            href: "/dashboard/users",
          },
        ]
      : []),

    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen]);

  // Focus sidebar when opened on mobile
  useEffect(() => {
    if (mobileMenuOpen && sidebarRef.current) sidebarRef.current.focus();
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-controls="dashboard-sidebar"
          aria-expanded={mobileMenuOpen}
          className="p-2 bg-cyan-500 text-white rounded-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        id="dashboard-sidebar"
        ref={sidebarRef}
        tabIndex={-1}
        role="navigation"
        aria-label="Dashboard sidebar"
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 flex flex-col`}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#00f0ff] to-[#0066ff] mb-26 text-center"
          >
            A2IT Dashbaord
          </Link>

          <nav className="space-y-2 mt-4">
            {menuItems.map((item) => {
              if (item.children) {
                return (
                  <PromotionalGroup
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    onCloseMobile={() => setMobileMenuOpen(false)}
                  />
                );
              }

              return (
                <DashboardNavLink
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  onClick={() => setMobileMenuOpen(false)}
                />
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout (now in normal flow so nav expansion won't overlap) */}
        <div className="p-6 border-t border-slate-200">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <p className="text-sm text-slate-500">Logged in as</p>
            <p className="text-slate-900 font-semibold">{user?.name}</p>
            <p className="text-xs text-cyan-600 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#ffffff]">
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-y-auto">
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
