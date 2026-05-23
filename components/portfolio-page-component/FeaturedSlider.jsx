// FeaturedSlider.jsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Image from "next/image";

const FeaturedSlider = ({
  projects,
  openProjectModal,
  sliderIndex,
  setSliderIndex,
  nextSlide,
  prevSlide,
}) => {
  const [currentImageIndices, setCurrentImageIndices] = useState(
    projects.reduce((acc, project, index) => {
      acc[index] = 0;
      return acc;
    }, {}),
  );

  const handleThumbnailClick = (projectIndex, imageIndex) => {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [projectIndex]: imageIndex,
    }));
  };

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="relative h-75 sm:h-100 md:h-125 lg:h-137.5 overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200 shadow-lg">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="absolute inset-0"
            initial={{ opacity: 0, x: "100%" }}
            animate={{
              opacity: sliderIndex === index ? 1 : 0,
              x:
                sliderIndex === index
                  ? "0%"
                  : sliderIndex < index
                    ? "100%"
                    : "-100%",
              zIndex: sliderIndex === index ? 10 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Mobile Layout - Stacked */}
            <div className="lg:hidden w-full h-full flex flex-col bg-white">
              {/* Image Section */}
              <div className="relative h-40 sm:h-48 md:h-56 shrink-0">
                {/* Main Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={project.images[currentImageIndices[index]]}
                    alt={`${project.title} - Image ${currentImageIndices[index] + 1}`}
                    fill
                    className="absolute inset-0 w-full h-full object-cover"
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent"></div>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
                    {currentImageIndices[index] + 1} / {project.images.length}
                  </div>

                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-sm">
                      <FiStar className="w-3 h-3" />
                      Featured
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(project.performance || project.metrics || [])
                    .slice(0, 2)
                    .map((metric, idx) => (
                      <div
                        key={idx}
                        className="text-center p-2 bg-blue-50 rounded-lg"
                      >
                        <div className="text-lg sm:text-xl font-bold text-blue-600">
                          {metric.value}
                        </div>
                        <div className="text-xs text-gray-600">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Features if available */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {project.features.slice(0, 2).map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-1.5 text-xs text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-0.5 shrink-0"></div>
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => openProjectModal(project)}
                  className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  View Case Study
                  <FiExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Thumbnails for Mobile */}
              {project.images.length > 1 && (
                <div className="p-3 border-t border-gray-100">
                  <div className="flex gap-2 overflow-x-auto">
                    {project.images.map((image, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={() => handleThumbnailClick(index, imgIndex)}
                        className={`shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all relative ${
                          currentImageIndices[index] === imgIndex
                            ? "border-indigo-700 scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${project.title} - Thumbnail ${imgIndex + 1}`}
                          fill
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Layout - Side by Side */}
            <div className="hidden lg:grid w-full h-full lg:grid-cols-2 gap-6 items-center bg-white p-6 lg:p-8">
              {/* Image Section with Thumbnails */}
              <div className="relative h-full">
                {/* Main Image */}
                <div className="relative h-70 lg:h-80 rounded-xl lg:rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={project.images[currentImageIndices[index]]}
                    alt={`${project.title} - Image ${currentImageIndices[index] + 1}`}
                    fill
                    className="absolute inset-0 w-full h-full object-cover"
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent"></div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                    {currentImageIndices[index] + 1} / {project.images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {project.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto py-2">
                    {project.images.map((image, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={() => handleThumbnailClick(index, imgIndex)}
                        className={`shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndices[index] === imgIndex
                            ? "border-blue-600 scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${project.title} - Thumbnail ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Featured Badge */}
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-sm">
                    <FiStar className="w-3 h-3" />
                    Featured
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-2 lg:p-4 xl:p-8">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-3 lg:text-lg">
                  {project.description}
                </p>

                {/* Detailed Description if available */}
                {project.detailedDescription && (
                  <p className="text-blue-600 mb-3 text-sm lg:text-base leading-relaxed line-clamp-3">
                    {project.detailedDescription}
                  </p>
                )}

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 5).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {(project.performance || project.metrics || []).map(
                    (metric, idx) => (
                      <div
                        key={idx}
                        className="text-center p-3 bg-blue-50 rounded-xl"
                      >
                        {metric.icon && (
                          <div className="text-xl mb-2">{metric.icon}</div>
                        )}
                        <div className="text-2xl font-bold text-blue-600">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {metric.label}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* Features if available */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {project.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => openProjectModal(project)}
                  className="w-full px-6 py-3 bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  View Full Case Study
                  <FiExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slider Controls */}
      {projects.length > 1 && (
        <>
          <div className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg bg-white/80 border border-gray-200 hover:bg-blue-50 transition-colors"
            >
              <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
            </button>
          </div>
          <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg bg-white/80 border border-gray-200 hover:bg-blue-50 transition-colors"
            >
              <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
            </button>
          </div>
        </>
      )}

      {/* Slider Dots */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 lg:mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setSliderIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                sliderIndex === index
                  ? "bg-blue-600 w-6 sm:w-8"
                  : "bg-gray-300 w-1.5 sm:w-2 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedSlider;
