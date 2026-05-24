"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Banner = () => {
  const router = useRouter();

  return (
    <div className="relative w-full  mx-auto aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-auto lg:h-[90vh] overflow-hidden">
      {/* Banner Image */}
      <Image
        src="/main-banner.jpeg"
        alt="Banner"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center quality-100"
        unoptimized
      />

      {/* Content Container - Positioned at bottom-left with padding */}
      <div className="absolute bottom-4 sm:bottom-26 left-1/2 sm:left-10 md:left-20 lg:left-32 transform -translate-x-1/2 sm:translate-x-0 w-full px-4 sm:px-0">
        {/* Buttons Container */}
        <div className="flex flex-row sm:flex-row gap-4 justify-center sm:justify-start">
          <button
            type="button"
            className="btn-3d flex justify-center items-center gap-2 group"
            onClick={() => router.push("/contact")}
          >
            Contact With Us
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            className="btn-neon flex items-center gap-2 group"
            onClick={() => router.push("/about")}
          >
            Learn More About Us
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .btn-3d {
          padding: 18px 45px;j
          font-size: 18px;
          font-weight: 700;
          color: white;
          background: linear-gradient(145deg, #66B2FF, #000099);
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          min-width: 220px;
          text-align: center;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        
        .btn-3d:hover {
          transform: translateY(-4px) rotateX(10deg);
          box-shadow: 
            0 15px 30px rgba(102, 126, 234, 0.4),
            inset 0 -3px 0 rgba(0,0,0,0.2);
          background: linear-gradient(145deg, #764ba2, #667eea);
        }
        
        .btn-3d:active {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 20px rgba(102, 126, 234, 0.3),
            inset 0 -2px 0 rgba(0,0,0,0.2);
        }
        
        /* Top edge effect */
        .btn-3d::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          height: 30%;
          background: linear-gradient(rgba(255,255,255,0.3), transparent);
          border-radius: 10px 10px 0 0;
          opacity: 0.6;
        }
        
        /* Neon Button Style - Fixed white background */
        .btn-neon {
          padding: 18px 35px;
          font-size: 18px;
          font-weight: 700;
          color: white;
          background: linear-gradient(145deg, #66B2FF, #000099);
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          min-width: 220px;
          text-align: center;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .btn-neon:hover {
          transform: translateY(-4px) rotateX(10deg);
          box-shadow: 
            0 15px 30px rgba(102, 126, 234, 0.4),
            inset 0 -3px 0 rgba(0,0,0,0.2);
          background: linear-gradient(145deg, #764ba2, #667eea);
        }
        
        .btn-neon:active {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 20px rgba(245, 87, 108, 0.3),
            inset 0 -2px 0 rgba(0,0,0,0.2);
        }
        
        /* Top edge effect */
        .btn-neon::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          height: 30%;
          background: linear-gradient(rgba(255,255,255,0.3), transparent);
          border-radius: 10px 10px 0 0;
          opacity: 0.6;
        }
        
        /* Responsive */
        /* Responsive */
        @media (max-width: 640px) {
          .btn-3d,
          .btn-neon {
            padding: 8px 10px;
            font-size: 12px;
            min-width: auto;     /* 🔑 allow buttons to shrink */
            width: auto;
            letter-spacing: 0.4px;
          }
        }

        /* Extra small devices (very small phones) */
        @media (max-width: 400px) {
          .btn-3d,
          .btn-neon {
            padding: 6px 8px;
            font-size: 10px;
          }
        }

      `}</style>
    </div>
  );
};

export default Banner;
