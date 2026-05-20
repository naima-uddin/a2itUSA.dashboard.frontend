"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_45%,_#ffffff_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-3xl border border-slate-200 bg-white/75 p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:block">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            A2IT Dashboard
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Sign in to manage blogs, services, portfolio, and site settings.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Use your admin credentials to access the dashboard and keep content
            updated from one place.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Fast access", "Jump directly into the dashboard."],
              ["Secure login", "Token-based auth with session storage."],
              ["Central control", "Manage content without leaving the site."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <h2 className="text-sm font-semibold text-slate-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Login to continue
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter your email and password to open the dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="admin@a2it.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Enter your password"
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
