"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "@/components/shared/contactSuccessRedirect";

const PACKAGE_OPTIONS = [
  { value: "Special", name: "Special", price: "$99/month" },
  { value: "Plus", name: "Plus", price: "$199/month" },
  { value: "Gold", name: "Gold", price: "$299/month" },
  { value: "Platinum", name: "Platinum", price: "$399/month" },
  { value: "The Boss", name: "The Boss", price: "$499/month" },
  { value: "Diamond", name: "Diamond", price: "$599/month" },
];

const normalizePackageValue = (pkg) => {
  if (!pkg) return "";
  const match = PACKAGE_OPTIONS.find(
    (option) =>
      pkg === option.value || pkg === `${option.name} (${option.price})`,
  );
  return match ? match.value : pkg;
};

const getPackageLabel = (pkg) => {
  if (!pkg) return "";
  const match = PACKAGE_OPTIONS.find(
    (option) =>
      pkg === option.value || pkg === `${option.name} (${option.price})`,
  );
  return match ? `${match.name} (${match.price})` : pkg;
};

const PromotionModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  buttonText = "SUBMIT NOW",
  selectedPackage = "",
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [packageValue, setPackageValue] = useState(
    normalizePackageValue(selectedPackage),
  );
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const packageDropdownRef = useRef(null);
  const selectedPackageOption = PACKAGE_OPTIONS.find(
    (option) => option.value === packageValue,
  );

  useEffect(() => {
    if (isOpen) {
      setPackageValue(normalizePackageValue(selectedPackage));
      return;
    }
    setIsPackageOpen(false);
  }, [isOpen, selectedPackage]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        packageDropdownRef.current &&
        !packageDropdownRef.current.contains(e.target)
      ) {
        setIsPackageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const selectedOption = PACKAGE_OPTIONS.find(
      (option) => option.value === data.package,
    );
    const packageWithPrice = getPackageLabel(data.package);
    const packageName = selectedOption?.name || data.package || "";
    const packagePrice = selectedOption?.price || "";

    try {
      const res = await fetch(
        "https://a2it-usa-dashboard-backend.vercel.app/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            package: packageWithPrice,
            packageName,
            price: packagePrice,
            message: data.message || "Customer wants to start a project!",
            type: "promotion_modal",
          }),
        },
      );

      const result = await res.json();
      if (result.success) {
        redirectToThankYou(router);
        onClose();
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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 p-3 md:p-6 animate-fadeIn"
      style={{ zIndex: 999999, position: "fixed" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-scaleIn relative max-h-[85vh] md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-full w-8 h-8 flex items-center justify-center transition-all z-10"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-4 md:p-8">
          {/* Title */}
          <h2
            className="text-xl md:text-3xl font-bold text-center mb-2 md:mb-3"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-700 font-medium text-xs md:text-base mb-4 md:mb-6">
            {subtitle}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name *"
                required
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 text-sm md:text-base"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address *"
                required
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 text-sm md:text-base"
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone Number *"
                required
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 text-sm md:text-base"
              />
            </div>

            <div>
              <label htmlFor="package" className="sr-only">
                Select Package
              </label>
              <div className="relative" ref={packageDropdownRef}>
                <input
                  type="hidden"
                  id="package"
                  name="package"
                  value={packageValue}
                />
                <button
                  type="button"
                  onClick={() => setIsPackageOpen((prev) => !prev)}
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                >
                  {selectedPackageOption ? (
                    <span className="flex items-center gap-2">
                      <span className="text-gray-900 text-sm md:text-base font-normal">
                        {selectedPackageOption.name}
                      </span>
                      <span className="text-[11px] md:text-xs font-normal text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                        ({selectedPackageOption.price})
                      </span>
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm md:text-base">
                      Select Package Type
                    </span>
                  )}

                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isPackageOpen ? "rotate-180" : ""}`}
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

                {isPackageOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {PACKAGE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setPackageValue(option.value);
                          setIsPackageOpen(false);
                        }}
                        className={`w-full px-3 md:px-4 py-2.5 text-left hover:bg-blue-500 transition-colors flex items-center justify-between ${packageValue === option.value ? "bg-blue-300" : ""}`}
                      >
                        <span className="text-gray-900 text-md font-normal">
                          {option.name}
                        </span>
                        <span className="text-[12px]  font-normal text-orange-700 bg-rose-50 px-2 py-0.5 rounded-full border border-orange-200">
                          ({option.price})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="To help us understand better, enter a brief description about your project."
                rows={3}
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 resize-none text-sm md:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 md:py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm md:text-base uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              {isSubmitting ? "SENDING..." : buttonText}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PromotionModal;
