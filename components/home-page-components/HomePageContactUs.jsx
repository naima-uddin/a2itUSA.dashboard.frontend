"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiMessageSquare,
  FiSend,
  FiClock,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "@/components/shared/contactSuccessRedirect";

const officePosition = [23.836236, 90.358672];

const HomePageContactUs = () => {
  const router = useRouter();
  const [position, setPosition] = useState(officePosition);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { name, email, message, phone: formData.phone };

    try {
      const res = await fetch(
        "https://a2it-usa-dashboard-backend.vercel.app/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (data.success) {
        redirectToThankYou(router);
        return;
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  if (!isClient) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Contact-Us.png')" }}
      />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/40"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:20px_20px]"></div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight">
            GET IN <span className="text-blue-600">TOUCH</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Connect with us to bring your digital vision to life
          </p>
        </motion.div>

        {/* Contact Content - Swapped positions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
          {/* Right side: Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={scaleUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-0.5 bg-blue-500 mr-3"></div>
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* USA Address */}
                <div className="group transform transition-all duration-300 hover:translate-x-1">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg mr-4">
                      <FiMapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-2">
                        USA Office
                      </h3>
                      <p className="text-gray-200 text-base leading-relaxed">
                        16192 Coastal Highway,
                        <br />
                        Lewes, DE 19958
                      </p>
                      <p className="text-gray-900 text-xl font-bold mt-2">
                        +1 (808) 301-5039
                      </p>
                    </div>
                  </div>
                </div>
                {/* Bangladesh Address */}
                <div className="group transform transition-all duration-300 hover:translate-x-1">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg mr-4">
                      <FiMapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-2">
                        Bangladesh Office
                      </h3>
                      <p className="text-gray-200 text-base leading-relaxed">
                        Plot No 470, Road No 06 (Old 29),
                        <br />
                        DOHS Mirpur, Dhaka Division,
                        <br />
                        Bangladesh
                      </p>
                      <p className="text-gray-900 text-xl font-bold mt-2">
                        +880 1846-937397
                      </p>
                    </div>
                  </div>
                </div>
                {/* Email */}
                <div className="group transform transition-all duration-300 hover:translate-x-1">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg mr-4">
                      <FiMail className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-2">
                        Email Address
                      </h3>
                      <p className="text-gray-900 text-xl font-bold">
                        info@a2itllc.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="group transform transition-all duration-300 hover:translate-x-1">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg mr-4">
                      <FiClock className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-2">
                        Working Hours
                      </h3>
                      <p className="text-gray-200 text-base">
                        Monday - Thursday{" "}
                        <span className="text-gray-900 font-semibold">
                          10AM - 7PM
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="pt-4 border-t border-white/20">
              <p className="text-gray-200 text-base italic">
                "We work with ambitious leaders who want to define the future,
                not hide from it."
              </p>
            </div>
          </motion.div>

          {/* Left side: Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={scaleUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-sm p-6 shadow-2xl border border-gray-100"
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-0.5 bg-blue-600 mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                Send Your Message
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold flex items-center"
                >
                  <FiUser className="mr-2 text-blue-600" />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Write your name"
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400"
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-semibold flex items-center"
                >
                  <FiPhone className="mr-2 text-blue-600" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 808-XXXXXX"
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold flex items-center"
                >
                  <FiMail className="mr-2 text-blue-600" />
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gmail.com"
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-semibold flex items-center"
                >
                  <FiMessageSquare className="mr-2 text-blue-600" />
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 resize-none placeholder-gray-400"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center space-x-2 mt-6"
              >
                <span>{isSubmitting ? "SENDING..." : "SEND MESSAGE"}</span>
                <FiSend className="ml-2" />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Response Time Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-4 border-t border-white/10"
        >
          <p className="text-gray-300 text-sm">
            We respond within{" "}
            <span className="text-blue-300 font-semibold">24 hours</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageContactUs;
