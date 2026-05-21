"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
// FloatingWhatsApp component to display a WhatsApp chat button
// with a floating animation and a default message.
const WhatsAppFloating = ({
  phoneNumber = "+1 (808) 301-5039",
  phone = undefined,
  message = "Hello! I have a query about your services.",
  position = { bottom: 30, right: 10 },
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return null;
  }

  // accept either `phone` or `phoneNumber` as prop (backwards-compatible)
  const effectivePhone = phone || phoneNumber;
  // sanitize phone number (remove spaces, +, dashes) so wa.me receives digits only
  const sanitizedNumber = String(effectivePhone).replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(
    message,
  )}`;

  const styleTag = `
    @keyframes gentleFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div
        style={{
          position: "fixed",
          bottom: position.bottom,
          right: position.right,
          zIndex: 50,
        }}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on WhatsApp (${sanitizedNumber})`}
          title={`Chat on WhatsApp (${sanitizedNumber})`}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#25D366",
            color: "white",
            borderRadius: "50px",
            padding: isHovered ? "10px 15px 10px 10px" : "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            overflow: "hidden",
            width: isHovered ? "auto" : "40px",
            height: "40px",
            textDecoration: "none",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            style={{
              animation: "gentleFloat 3s ease-in-out infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "18px",
              height: "18px",
              flexShrink: 0,
            }}
          >
            <FaWhatsapp style={{ fontSize: "20px" }} />
          </div>

          {isHovered && (
            <span
              style={{
                marginLeft: "8px",
                fontSize: "14px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                paddingRight: "4px",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            >
              Chat with us
            </span>
          )}
        </a>
      </div>
    </>
  );
};

export default WhatsAppFloating;
