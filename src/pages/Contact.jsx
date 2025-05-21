import React, { useEffect, useState } from "react";
import Header from "../home/Header";
import Footer from "../home/Footer";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const Contact = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const socialIcons = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      svg: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-600 transition"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.3l-.4 2.9h-1.9v7A10 10 0 0022 12z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      svg: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 hover:text-pink-500 transition"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7.8 2h8.4C19 2 22 5 22 7.8v8.4c0 2.8-3 5.8-5.8 5.8H7.8C5 22 2 19 2 16.2V7.8C2 5 5 2 7.8 2zm0 2C6.1 4 4 6.1 4 7.8v8.4C4 17.9 6.1 20 7.8 20h8.4c1.7 0 3.8-2.1 3.8-3.8V7.8C20 6.1 17.9 4 16.2 4H7.8zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm4.5-.9a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      svg: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 hover:text-sky-400 transition"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.27 4.27 0 0016.1 4c-2.3 0-4.16 1.86-4.16 4.16 0 .33.04.65.11.96-3.46-.17-6.54-1.83-8.6-4.35a4.1 4.1 0 00-.56 2.1 4.17 4.17 0 001.85 3.47 4.2 4.2 0 01-1.88-.52v.05c0 2.04 1.45 3.74 3.38 4.12a4.3 4.3 0 01-1.87.07c.53 1.66 2.08 2.88 3.91 2.92A8.59 8.59 0 013 18.13 12.1 12.1 0 009.29 20c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.35 8.35 0 0022.46 6z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/6281234567890",
      svg: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 hover:text-green-500 transition"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 00-8.93 14.5l-1.04 3.83 3.93-1.02A10 10 0 1012 2zm5.42 14.08c-.23.64-1.36 1.26-1.9 1.34-.5.08-1.14.1-1.83-.14a16.2 16.2 0 01-2.76-1.26 9.07 9.07 0 01-3.3-3.3c-.25-.44-.54-1.1-.63-1.67-.09-.58-.01-1.07.13-1.34.15-.27.33-.42.57-.48.23-.06.52-.03.84.02.27.05.58.14.75.47l.9 2c.07.17.04.34-.05.49l-.3.5c-.1.16-.2.26-.16.35.14.27.6.96 1.46 1.57.86.6 1.54.8 1.84.9.2.07.32.06.45-.1l.39-.56c.1-.15.24-.2.4-.13l2.3 1c.17.08.3.13.36.2.05.05.08.23 0 .47z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-base-100 dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Loading Contact Page...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact Us</title>
        <meta name="description" content="Contact page of Wonderful Shop" />
        <meta name="keywords" content="Contact, Wonderful Shop, Help" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
      <Header />
      
      <div className="bg-colorback dark:bg-gray-800 py-8 sm:py-12 min-h-screen">
        <motion.div
          className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-5xl mx-auto text-black dark:text-white"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
            Contact Us
          </h1>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 sm:p-8 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-5 md:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Get in Touch
                </h2>
                
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-full">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:hello@wonderfulshop.com" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                      hello@wonderfulshop.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-full">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+6281234567890" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                      +62 812 3456 7890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-full">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p>Jl. Kebahagiaan No. 99, Jakarta</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">Follow Us</p>
                  <div className="flex gap-4">
                    {socialIcons.map((item) => (
                      <a 
                        key={item.name} 
                        href={item.href} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition"
                        aria-label={`Follow us on ${item.name}`}
                      >
                        {item.svg}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Our Location
                </h2>
                <div className="h-64 sm:h-80 md:h-72 lg:h-80 overflow-hidden rounded-xl shadow">
                  <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.999018812165!2d106.82715331529347!3d-6.200000395513019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f1b2d3b8e5%3A0xf3c408a3d6d946!2sJakarta!5e0!3m2!1sen!2sid!4v1611994433345!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full object-cover"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  );
};

export default Contact;