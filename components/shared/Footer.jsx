"use client";

import Logo from "./Logo";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const [showAllServices, setShowAllServices] = useState(false);
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  if (pathname?.startsWith("/promotions")) return null;

  const services = [
    { name: "Design & Development", url: "/services/design-development" },
    { name: "E-Commerce", url: "/services/e-commerce" },
    { name: "Amazon", url: "/services/amazon" },
    { name: "Shopify", url: "/services/shopify" },
    { name: "ERP System Development", url: "/services/erp" },
    { name: "SEO / SEM / PPC", url: "/services/seo" },
    { name: "Server and Hosting Services", url: "/services/server-hosting" },
    { name: "E-bay", url: "/services/e-bay" },
  ];

  const displayedServices = showAllServices ? services : services.slice(0, 4);
  const currentYear = new Date().getFullYear();

  const toggleServices = () => {
    setShowAllServices(!showAllServices);
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-8">
          {/* First Row: Logo + Contact Info in FLEX ROW */}
          <div className="flex flex-row gap-6 items-start">
            {/* Logo Section - Left side */}
            <div className="flex-1">
              <Logo />
              <p className="mt-2 text-blue-600 font-bold text-lg">A2IT LLC</p>
            </div>

            {/* Contact Info Section - Right side */}
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Call Toll Free
                  </p>
                  <p className="text-blue-600 font-bold text-sm">
                    +1 (808) 301-5039
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Email Support
                  </p>
                  <p className="text-blue-600 font-bold text-sm">
                    info@a2itllc.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: Quick Links + Services in FLEX ROW */}
          <div className="flex flex-row gap-6 pt-6 border-t border-gray-200">
            {/* Quick Links - Left side */}
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                  >
                    Get Quote
                  </a>
                </li>
              </ul>
            </div>

            {/* Services - Right side */}
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Our Services</h3>
              <div className="space-y-2">
                {displayedServices.map((service, index) => (
                  <a
                    key={index}
                    href={service.url}
                    className="flex items-start hover:text-blue-600 transition-colors duration-300"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-gray-600 text-sm">
                      {service.name}
                    </span>
                  </a>
                ))}

                {services.length > 4 && (
                  <button
                    onClick={toggleServices}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center mt-2"
                  >
                    {showAllServices ? "Show Less" : "More Services"}
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform duration-300 ${showAllServices ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Third Row: Newsletter - Full width */}
          <div className="pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">Stay Updated</h3>
              <p className="text-gray-600 text-sm">
                Talk to our experts today and discover how we can help your
                business thrive in the digital world.Great service and support
                eagerly waiting to assist you.
              </p>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm transition-colors duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - EXACTLY same as original */}
        <div className="hidden md:grid md:grid-cols-4 gap-12 mb-10">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <Logo />
              <p className="mt-1 text-blue-600 font-bold text-lg">A2IT LLC</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call Now </p>
                  <p className="text-blue-600 font-bold">+1 (808) 301-5039</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <p className="text-blue-600 font-bold">info@a2itllc.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 relative pb-3">
              <span className="relative">
                Quick Links
                <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Get Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6 relative pb-3">
              <span className="relative">
                Our Services
                <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {displayedServices.map((service, index) => (
                <a
                  key={index}
                  href={service.url}
                  className="flex items-start group"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors duration-300">
                    {service.name}
                  </span>
                </a>
              ))}

              {services.length > 4 && (
                <button
                  onClick={toggleServices}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors duration-300 group"
                >
                  {showAllServices ? "Show Less" : "More Services"}
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-300 ${showAllServices ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 relative pb-3">
              <span className="relative">
                Stay Updated
                <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </span>
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm transition-colors duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-600">
            <p className="font-medium">© 2026 A2IT LLC. All rights reserved.</p>
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6">
            <a
              href="/privacy-policy"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Terms of Service
            </a>
            <a
              href="/advertiser-disclosure"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Advertiser Disclosure
            </a>
          </div>
        </div>

        {/* Optional: Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-3 bg-white border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Back to top"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-y-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
