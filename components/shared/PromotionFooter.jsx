"use client";
import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "@/components/shared/contactSuccessRedirect";

export default function PromotionFooter({ config = {} }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const headline =
    config.headline || "Sign up now for the ultimate website experience!";
  const description =
    config.description ||
    "A2IT LLC is your all-in-one web design and development agency, featuring a team of skilled and imaginative developers, marketers, and designers.";
  const copyrightText =
    config.copyrightText || "Copyright © 2026 A2IT LLC | All rights reserved.";
  const logoImage =
    typeof config.logoImage === "string" && config.logoImage.trim()
      ? config.logoImage
      : "/A2ITLogo.png";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch(
        "https://a2it-usa-dashboard-backend.vercel.app/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message || "Customer sent a message from footer form",
            type: "footer_inquiry",
          }),
        },
      );

      const result = await res.json();
      if (result.success) {
        redirectToThankYou(router);
        e.target.reset();
      } else {
        toast.error("Failed to send message. Please try again.", {
          duration: 4000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      className="relative w-full bg-center bg-cover rounded-2xl md:rounded-3xl overflow-hidden max-h-180"
      style={{ backgroundImage: "url('/promotionPortfolio/footerbg.jpeg')" }}
    >
      {/* Layered overlay - inspired by navbar styling */}
      <div className="absolute inset-0 bg-[#0F1B32]/55 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="text-white max-w-xl mt-0 md:mt-10">
            <Image
              src={logoImage}
              alt="A2it Logo"
              width={150}
              height={50}
              className="mb-4 md:mb-6 w-32 md:w-36 h-auto"
            />
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold leading-tight mb-4 md:mb-6">
              {headline}
            </h2>
            <p className="text-sm md:text-base text-white/90 mb-6 md:mb-8">
              {description}
            </p>

            <div className="space-y-2 md:space-y-3 mt-4 md:mt-6">
              <div className="flex items-center gap-2 md:gap-3 text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  style={{ width: "18px", height: "18px" }}
                >
                  <path
                    d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                    fill="currentColor"
                    className="text-white"
                  />
                </svg>
                <span className="font-medium text-sm md:text-base">
                  +1 (808) 301-5039
                </span>
              </div>

              <div className="flex items-center gap-2 md:gap-3 text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  style={{ width: "18px", height: "18px" }}
                >
                  <path
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    fill="currentColor"
                    className="text-white"
                  />
                </svg>
                <a
                  href="mailto:info@a2itllc.com"
                  className="font-medium text-sm md:text-base hover:underline"
                >
                  info@a2itllc.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#FFD6A7]/25 rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 shadow-2xl transparent ">
            <h3 className="text-base md:text-lg lg:text-2xl font-semibold text-white mb-4 md:mb-6">
              SEND A MESSAGE
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <input
                name="name"
                placeholder="Your Name"
                className="w-full rounded-md p-2.5 md:p-3 border border-[#FFD6A7] bg-[#FFD6A7]/70 text-xs md:text-sm text-white placeholder:text-white/70 outline-none"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full rounded-md p-2.5 md:p-3 border border-[#FFD6A7] bg-[#FFD6A7]/70 text-xs md:text-sm placeholder:text-white/70 outline-none text-white"
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-md p-2.5 md:p-3 border border-[#FFD6A7] bg-[#FFD6A7]/70 text-xs md:text-sm text-white placeholder:text-white/70 outline-none"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                className="w-full rounded-md p-2.5 md:p-3 border border-[#FFD6A7] bg-[#FFD6A7]/70 text-xs md:text-sm text-white placeholder:text-white/70 outline-none resize-none"
              />

              <div className="flex justify-center mt-2 mb-10 md:mb-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-linear-to-r from-[#7ebaf5] to-[#00006d] hover:scale-95 text-white text-sm md:text-base font-semibold rounded-full px-8 md:px-10 py-2.5 md:py-3 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 md:mt-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 ">
          <div className="flex items-center gap-4">
            <div className="w-48 md:w-64 lg:w-96" style={{ marginTop: 0 }}>
              <Image
                src="/promotionPortfolio/cards.png"
                alt="Payment methods"
                width={384}
                height={56}
                className="object-contain w-full h-auto"
              />
            </div>
          </div>
          <div className="text-white/60 text-xs md:text-sm text-center md:text-left">
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
}
