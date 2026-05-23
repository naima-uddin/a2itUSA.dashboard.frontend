"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  Play,
  Award,
  Users,
  Globe,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Building,
  Heart,
  ArrowUpRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import ContactUs from "../contact-page-component/ContactUs";
import ContactBanner from "./ContactBanner";
import HomePageContactUs from "../home-page-components/HomePageContactUs";
import WhoRWe from "../home-page-components/WhoRWe";
import Link from "next/link";

const About = () => {
  const values = [
    {
      title: "Radical Innovation",
      description:
        "We challenge conventions and push technological boundaries.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Human-Centered",
      description: "Technology serves people, not the other way around.",
      icon: <Heart className="w-6 h-6" />,
      color: "from-orange-500 to-red-400",
    },
    {
      title: "Integrity First",
      description: "Transparent, ethical, and accountable in all we do.",
      icon: <Shield className="w-6 h-6" />,
      color: "from-blue-600 to-indigo-400",
    },
    {
      title: "Global Impact",
      description: "Solving problems that matter on a global scale.",
      icon: <Globe className="w-6 h-6" />,
      color: "from-orange-600 to-amber-400",
    },
  ];

  return (
    <div className=" bg-white text-gray-900">
      {/* Hero Section with Image */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] py-12 sm:py-16 md:py-20 flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-30"></div>
        </div>

        {/* Geometric Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 border-2 border-blue-500/30 rotate-45"></div>
          <div className="absolute bottom-40 left-32 w-40 h-40 border border-orange-500/20 rotate-12"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-blue-600/10 -rotate-12"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 md:mb-8 border border-white/20 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Since 2015 • Redefining Technology
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl  xl:text-6xl font-bold mb-6 leading-none">
              <span className="text-white">Innovating</span>
              <div className="relative inline-block ml-2 sm:ml-4">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                  Your Future
                </span>
                <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>
              </div>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl leading-relaxed">
              Transforming ideas into reality with cutting-edge technology
              solutions. We empower businesses to thrive in the digital era
              through innovation and expertise.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link href="/contact-us">
                <button className="btn-3d flex items-center justify-center gap-2 group w-full sm:w-auto">
                  <span className="text-sm sm:text-base">Contact With Us</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/portfolio">
                <button className="btn-neon flex items-center justify-center gap-2 group w-full sm:w-auto">
                  <span className="text-sm sm:text-base">
                    Watch Our Success Story
                  </span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-sm font-medium mb-2">
            Scroll to explore
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent mx-auto"></div>
        </div>
      </section>

      <WhoRWe />

      {/* Philosophy Section Where Precision Meets Passion*/}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <div>
              <div className="sticky top-32">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-orange-500"></div>
                  <span className="text-sm font-semibold text-gray-500">
                    OUR PHILOSOPHY
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                  Where <span className="text-blue-600">Precision</span> Meets{" "}
                  <span className="text-orange-500">Passion</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
                  We believe the most profound innovations emerge at the
                  intersection of technical excellence and human understanding.
                </p>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                      9+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Years of Excellence
                    </div>
                  </div>
                  <div className="h-8 sm:h-12 w-px bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
                      150+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Global Partners
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              <div className="flex flex-col sm:flex-row bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-blue-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 md:mr-6">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4">
                    Purpose-Driven Innovation
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Every solution we create serves a meaningful purpose. We
                    don't just build technology—we solve real human problems.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-orange-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 md:mr-6">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4">
                    Collective Intelligence
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Our diverse team brings together expertise from across the
                    globe, creating a melting pot of ideas and perspectives.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 md:mr-6">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4">
                    Sustainable Growth
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We measure success not just in profits, but in positive
                    impact and sustainable progress for all stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid The A2IT Ethos*/}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-14 md:mb-20">
              <div className="inline-flex items-center gap-2 text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                CORE PRINCIPLES
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                The A2IT Ethos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl overflow-hidden"
                >
                  {/* Animated background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 text-white`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4">
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {value.description}
                    </p>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.color} opacity-10 rotate-45 translate-x-16 -translate-y-16`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomePageContactUs />
      <style jsx>{`
        .btn-3d {
          padding: 18px 45px;
          font-size: 18px;
          font-weight: 700;
          color: white;
          background: linear-gradient(145deg, #66b2ff, #000099);
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          min-width: 220px;
          text-align: center;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .btn-3d:hover {
          transform: translateY(-4px) rotateX(10deg);
          box-shadow:
            0 15px 30px rgba(102, 126, 234, 0.4),
            inset 0 -3px 0 rgba(0, 0, 0, 0.2);
          background: linear-gradient(145deg, #764ba2, #667eea);
        }

        .btn-3d:active {
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px rgba(102, 126, 234, 0.3),
            inset 0 -2px 0 rgba(0, 0, 0, 0.2);
        }

        /* Top edge effect */
        .btn-3d::before {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          height: 30%;
          background: linear-gradient(rgba(255, 255, 255, 0.3), transparent);
          border-radius: 10px 10px 0 0;
          opacity: 0.6;
        }

        /* Neon Button Style - Fixed white background */
        .btn-neon {
          padding: 18px 45px;
          font-size: 18px;
          font-weight: 700;
          color: white;
          background: linear-gradient(145deg, #66b2ff, #000099);
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          min-width: 220px;
          text-align: center;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .btn-neon:hover {
          transform: translateY(-4px) rotateX(10deg);
          box-shadow:
            0 15px 30px rgba(102, 126, 234, 0.4),
            inset 0 -3px 0 rgba(0, 0, 0, 0.2);
          background: linear-gradient(145deg, #764ba2, #667eea);
        }

        .btn-neon:active {
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px rgba(245, 87, 108, 0.3),
            inset 0 -2px 0 rgba(0, 0, 0, 0.2);
        }

        /* Top edge effect */
        .btn-neon::before {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          height: 30%;
          background: linear-gradient(rgba(255, 255, 255, 0.3), transparent);
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
            min-width: auto; /* 🔑 allow buttons to shrink */
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

export default About;
