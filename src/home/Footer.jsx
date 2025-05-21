import React from "react";

const Footer = () => {
  return (
    <footer className="bg-teal-700 dark:bg-gray-900 text-white py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-12">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start md:w-1/3">
            <div className="mb-4 flex items-center gap-2">
              <img src="/book.svg" alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-xl md:text-2xl font-text">
                Rea<span className="text-yellow-400">Buk</span>
              </h1>
            </div>
            <p className="text-sm text-gray-200 dark:text-gray-300 text-center md:text-left mb-4">
              Your ultimate destination for books, novels, and comics. Explore our vast collection of literature from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-center md:text-left">Quick Links</h3>
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm md:text-base font-medium">
              <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Library</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-center md:text-left">Connect With Us</h3>
            <div className="flex justify-center md:justify-start gap-4 mb-4">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" 
                className="bg-white bg-opacity-20 hover:bg-yellow-400 p-2 rounded-full transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.3l-.4 2.9h-1.9v7A10 10 0 0022 12z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="bg-white bg-opacity-20 hover:bg-yellow-400 p-2 rounded-full transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8 2h8.4C19 2 22 5 22 7.8v8.4c0 2.8-3 5.8-5.8 5.8H7.8C5 22 2 19 2 16.2V7.8C2 5 5 2 7.8 2zm0 2C6.1 4 4 6.1 4 7.8v8.4C4 17.9 6.1 20 7.8 20h8.4c1.7 0 3.8-2.1 3.8-3.8V7.8C20 6.1 17.9 4 16.2 4H7.8zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm4.5-.9a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"
                className="bg-white bg-opacity-20 hover:bg-yellow-400 p-2 rounded-full transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.27 4.27 0 0016.1 4c-2.3 0-4.16 1.86-4.16 4.16 0 .33.04.65.11.96-3.46-.17-6.54-1.83-8.6-4.35a4.1 4.1 0 00-.56 2.1 4.17 4.17 0 001.85 3.47 4.2 4.2 0 01-1.88-.52v.05c0 2.04 1.45 3.74 3.38 4.12a4.3 4.3 0 01-1.87.07c.53 1.66 2.08 2.88 3.91 2.92A8.59 8.59 0 013 18.13 12.1 12.1 0 009.29 20c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.35 8.35 0 0022.46 6z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" aria-label="WhatsApp"
                className="bg-white bg-opacity-20 hover:bg-yellow-400 p-2 rounded-full transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-8.93 14.5l-1.04 3.83 3.93-1.02A10 10 0 1012 2zm5.42 14.08c-.23.64-1.36 1.26-1.9 1.34-.5.08-1.14.1-1.83-.14a16.2 16.2 0 01-2.76-1.26 9.07 9.07 0 01-3.3-3.3c-.25-.44-.54-1.1-.63-1.67-.09-.58-.01-1.07.13-1.34.15-.27.33-.42.57-.48.23-.06.52-.03.84.02.27.05.58.14.75.47l.9 2c.07.17.04.34-.05.49l-.3.5c-.1.16-.2.26-.16.35.14.27.6.96 1.46 1.57.86.6 1.54.8 1.84.9.2.07.32.06.45-.1l.39-.56c.1-.15.24-.2.4-.13l2.3 1c.17.08.3.13.36.2.05.05.08.23 0 .47z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white border-opacity-20 mt-6 pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-300">
            &copy; {new Date().getFullYear()} ReaBuk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;