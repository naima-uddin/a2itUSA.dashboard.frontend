"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import animationData from "@/public/document.json";
import { THANK_YOU_DELAY_MS } from "@/components/shared/contactSuccessRedirect";

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(THANK_YOU_DELAY_MS / 1000),
  );

  const safeRedirectTarget = useMemo(() => {
    return redirectTo.startsWith("/") ? redirectTo : "/";
  }, [redirectTo]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      router.replace(safeRedirectTarget);
    }, THANK_YOU_DELAY_MS);

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [router, safeRedirectTarget]);

  return (
    <div className=" flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-2xl md:p-12">
        <div className="relative z-10">
          {/* Lottie Animation */}
          <div className="mx-auto mb-6 w-40 h-40">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-sky-600">
            Message received
          </p>
          <h1
            className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            Thank you for your email
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
            We&apos;ll contact you shortly. This page will take you back to the
            previous page automatically.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-sm font-medium text-gray-900">
            Redirecting in{" "}
            <span className="text-sky-600 font-semibold">{secondsLeft}s</span>
          </div>

          <button
            type="button"
            onClick={() => router.replace(safeRedirectTarget)}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Go back now
          </button>
        </div>
      </div>
    </div>
  );
}
