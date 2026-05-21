"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Users, FileText, ShoppingCart, Image, Calendar } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "./components/DashboardLayout";

export default function Dashboard() {
  const { user, token } = useAuth();

  const stats = [
    {
      label: "Total Blogs",
      value: "0",
      icon: FileText,
      color: "from-[#00f0ff]",
      href: "/dashboard/blogs",
    },
    {
      label: "Total Services",
      value: "11",
      icon: ShoppingCart,
      color: "from-[#0066ff]",
      href: "/dashboard/services",
    },
    {
      label: "Portfolio Items",
      value: "0",
      icon: Image,
      color: "from-[#00a0ff]",
      href: "/dashboard/portfolio",
    },
    ...(user?.role === "admin"
      ? [
          {
            label: "Total Users",
            value: "0",
            icon: Users,
            color: "from-[#f5b342]",
            href: "/dashboard/users",
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back,{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, #00f0ff, #0066ff)",
              }}
            >
              {user?.name}
            </span>
          </h1>
          <p className="text-slate-600">
            Manage your A2IT content and team from here
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={stat.href}>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-cyan-300 transition cursor-pointer group shadow-sm">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition"
                      style={{
                        backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from, #00f0ff), #0066ff)`,
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/dashboard/blogs?action=create">
              <button
                className="w-full hover:shadow-lg hover:shadow-[#00f0ff]/20 text-[#0a0a12] font-semibold py-3 rounded-lg transition"
                style={{
                  backgroundImage: "linear-gradient(135deg, #00f0ff, #0066ff)",
                }}
              >
                📝 Create Blog
              </button>
            </Link>
            <Link href="/dashboard/services?action=create">
              <button
                className="w-full hover:shadow-lg hover:shadow-[#0066ff]/20 text-[#0a0a12] font-semibold py-3 rounded-lg transition"
                style={{
                  backgroundImage: "linear-gradient(135deg, #0066ff, #00a0ff)",
                }}
              >
                🛍️ Create Service
              </button>
            </Link>
            <Link href="/dashboard/portfolio?action=create">
              <button
                className="w-full hover:shadow-lg hover:shadow-[#00a0ff]/20 text-[#0a0a12] font-semibold py-3 rounded-lg transition"
                style={{
                  backgroundImage: "linear-gradient(135deg, #00a0ff, #00f0ff)",
                }}
              >
                🖼️ Create Project
              </button>
            </Link>
            <Link href="/dashboard/promotions">
              <button
                className="w-full hover:shadow-lg hover:shadow-[#00f0ff]/20 text-[#0a0a12] font-semibold py-3 rounded-lg transition"
                style={{
                  backgroundImage: "linear-gradient(135deg, #00f0ff, #0066ff)",
                }}
              >
                🔗 Manage Promotion Pages
              </button>
            </Link>
            <Link href="/dashboard/employees">
              <button
                className="w-full hover:shadow-lg hover:shadow-[#0066ff]/20 text-[#0a0a12] font-semibold py-3 rounded-lg transition"
                style={{
                  backgroundImage: "linear-gradient(135deg, #0066ff, #00a0ff)",
                }}
              >
                🖼️ Manage Employees
              </button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/dashboard/users?action=create">
                <button
                  className="w-full hover:shadow-lg hover:shadow-[#f5b342]/20 text-[#0a0a12] font-semibold py-3 rounded-lg transition"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f5b342, #ffb84d)",
                  }}
                >
                  👤 Add User
                </button>
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-[#00f0ff]" />
            <h2 className="text-2xl font-bold text-slate-900">
              Getting Started
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
              <div className="w-3 h-3 bg-[#00f0ff] rounded-full mt-2 shrink-0" />
              <div>
                <p className="text-slate-900 font-medium">
                  Manage Your Content
                </p>
                <p className="text-slate-600 text-sm">
                  Use the sidebar to navigate to Blogs, Services, Portfolio,
                  Promotion Pages, Employees, and Settings.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
              <div className="w-3 h-3 bg-[#00f0ff] rounded-full mt-2 shrink-0" />
              <div>
                <p className="text-slate-900 font-medium">
                  Create and Edit Content
                </p>
                <p className="text-slate-600 text-sm">
                  Use the Quick Actions above or go to the dedicated sections to
                  manage entries.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
              <div className="w-3 h-3 bg-[#00f0ff] rounded-full mt-2 shrink-0" />
              <div>
                <p className="text-slate-900 font-medium">Admin Access</p>
                <p className="text-slate-600 text-sm">
                  User management is available only for admin accounts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-[#00f0ff] rounded-full mt-2 shrink-0" />
              <div>
                <p className="text-slate-900 font-medium">Account Settings</p>
                <p className="text-slate-600 text-sm">
                  Update your profile and change your password in Settings.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
