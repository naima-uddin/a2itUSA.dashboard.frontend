"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

const PromotionNavbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);


  // prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      {/* Desktop navbar */}
      <div className="fixed top-0 md:top-1 left-0 right-0 z-50 pt-1 ">
        <div className="max-w-360 w-full mx-auto ">
          <div
            className="w-full max-w-7xl h-18 mx-auto flex items-center justify-between rounded-full p-2"
            style={{ backgroundColor: "rgba(15, 27, 50, 0.2)" }}
          >
            <div
              className="w-full h-full flex items-center justify-between bg-[#0F1B32]/30 backdrop-blur-md rounded-full"
              style={{ border: "0.5px solid #124163" }}
            >
              <Link href="/promotions" className="flex items-center ml-4.5">
                <Image
                  src="/mainlogo.png"
                  height={30}
                  width={72}
                  alt="KL TINT"
                  className="object-contain"
                  priority
                />
              </Link>
         

              {/* Contact Buttons */}
              <div className="hidden lg:flex items-center gap-3 mr-3">
                {/* Phone Button */}
                <a
                  href="tel:+18083015039"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A8B9B] hover:bg-[#157A88] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="white"/>
                  </svg>
                  <span className="text-white font-semibold text-sm">+1 (808) 301-5039</span>
                </a>

                {/* Email Button */}
                <a
                  href="mailto:info@a2itllc.com"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E63946] hover:bg-[#D62936] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
                  </svg>
                  <span className="text-white font-semibold text-sm">info@a2itllc.com</span>
                </a>

                {/* Chat Button */}
                <button
                  onClick={() => window.open('https://wa.me/18083015039', '_blank')}
                  className="px-5 py-2 rounded-full bg-[#1F2937] hover:bg-[#374151] transition-colors text-white font-bold text-sm"
                >
                  CHAT WITH US
                </button>
              </div>

              {/* Hamburger Menu Button */}
              <button
                aria-label="Menu"
                className="flex items-center justify-center border border-[#124163]/60 bg-[#124163]/60 backdrop-blur-sm rounded-full px-3 hover:bg-[#252A3C]/70 transition-all mr-2"
                onClick={() => setIsOpen(true)}
              >
                <Image
                  src="/jam_menu.png"
                  width={45}
                  height={45}
                  alt="Menu"
                  className="object-contain h-10"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-32" onClick={() => setIsOpen(false)}>
          {/* Background */}
          <div className="absolute inset-0 bg-transparent" onClick={() => setIsOpen(false)} />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 pointer-events-none"
            style={{ backgroundImage: "url('/navbar/navbar-bg.png')" }}
          />



          {/* Main Layout - simplified promotional menu */}
          <div className="relative z-20 w-full flex items-start justify-center px-4 md:px-20" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-3xl relative text-center bg-[#071331]/70 rounded-2xl p-6 md:p-10 max-h-[70vh] overflow-y-auto shadow-2xl">
              <button
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-40 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <AiOutlineClose className="text-white" size={24} />
              </button>
              <Image
                src="/mainlogo.png"
                width={120}
                height={62}
                alt="Logo"
                className="mx-auto mb-8 object-contain"
              />

              <div className="flex flex-col items-center gap-6">
                <div className="w-full bg-gradient-to-br from-[#071331]/60 via-[#0b2a45]/50 to-[#071331]/70 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/5">
                  <h3 className="text-white text-base font-semibold mb-1">Get in touch</h3>
                  <p className="text-slate-300 text-xs mb-4">Quick responses — call, email or chat on WhatsApp.</p>

                  <div className="grid grid-cols-1 gap-3">
                    <a
                      href="tel:+18083015039"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#0EA5A4] hover:scale-[1.02] transform transition duration-200 shadow-md"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="white"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm">+1 (808) 301-5039</div>
                        <div className="text-slate-200 text-[10px]">Call us</div>
                      </div>
                    </a>

                    <a
                      href="mailto:info@a2itllc.com"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EF4444] hover:scale-[1.02] transform transition duration-200 shadow-md"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm">info@a2itllc.com</div>
                        <div className="text-slate-200 text-[10px]">Email us</div>
                      </div>
                    </a>

                    <button
                      onClick={() => { setIsOpen(false); window.open('https://wa.me/18083015039', '_blank'); }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-black/80 hover:scale-[1.02] transform transition duration-200 text-white font-bold text-sm shadow-2xl"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="white"/>
                      </svg>
                      CHAT WITH US
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 mt-4">We typically respond within a few hours — available Mon–Fri, 8am–6pm EST.</div>
              </div>              
            </div>
          </div>


        </div>
      )}
    </>
  );
};

export default PromotionNavbar;
