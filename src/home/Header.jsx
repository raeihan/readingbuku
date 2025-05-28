import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../SupaClient";
import { useAuth } from "../auth/UseAuth";
import { Theme } from "../daisyui/Theme";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const suggestionRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Using useAuth to access user state
  const { user, auth, full_name, avatar_url, logout } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const { data: books } = await supabase
          .from("book")
          .select("id, book_name, cover_book")
          .ilike("book_name", `%${searchTerm}%`);

        const { data: authors } = await supabase
          .from("author")
          .select("id, name, profile_author")
          .ilike("name", `%${searchTerm}%`);

        setSuggestions([
          ...(books || []).map((item) => ({ type: "book", id: item.id, name: item.book_name, cover: item.cover_book })),
          ...(authors || []).map((item) => ({ type: "author", id: item.id, name: item.name, cover: item.profile_author }))
        ]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  useEffect(() => {
    // Function to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
      
      if (suggestions.length > 0 && !event.target.closest('.search-container')) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, suggestions.length]);

  const handleSelect = (item) => {
    setSearchTerm("");
    setSuggestions([]);
    if (item.type === "book") {
      navigate(`/detail/${encodeURIComponent(item.name)}`);
    } else {
      navigate(`/authorpages/${encodeURIComponent(item.name)}`);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if user is logged in
  const isLoggedIn = auth || localStorage.getItem("sb-ggigrakpmocwmzfyrzdi-auth-token");

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/library", label: "Library" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <header className="bg-teal-700 w-full sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto md:px-6 px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="font-text text-white text-xl lg:text-2xl font-bold">
                Reading<span className="text-yellow-400">Buku</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`text-white hover:text-yellow-400 px-3 py-2 text-base font-text transition-colors duration-200 ${
                    location.pathname === link.to ? "text-yellow-400 border-b-2 border-yellow-400" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Desktop Search Bar */}
          <div className="hidden lg:block search-container relative flex-1 max-w-md mx-6">
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            {suggestions.length > 0 && (
              <div ref={suggestionRef} className="absolute top-12 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-black flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelect(item)}
                  >
                    {item.cover && (
                      <img 
                        src={item.cover} 
                        alt={item.name} 
                        className="w-10 h-12 object-cover rounded shadow-sm flex-shrink-0" 
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{item.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            <Theme />
            
            {/* User Profile or Login */}
            {isLoggedIn ? (
              <div className="profile-dropdown relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-yellow-400 flex items-center justify-center overflow-hidden bg-white">
                    {avatar_url ? (
                      <img 
                        src={avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-yellow-400 w-full h-full flex items-center justify-center text-teal-700 font-bold text-lg">
                        {full_name ? full_name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                </button>
                
                {/* Desktop Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-text font-semibold text-gray-800">{full_name || "User"}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button 
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-150"
                    >
                      Profile
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors duration-150"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-yellow-400 hover:bg-yellow-500 text-teal-700 px-6 py-2 rounded-lg font-text font-semibold transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Theme />
            <button
              type="button"
              className="text-white hover:bg-teal-600 p-2 rounded-md transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-teal-800 border-t border-teal-600`}>
        <div className="px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <div className="search-container relative">
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-14 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-black flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      handleSelect(item);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.cover && (
                      <img 
                        src={item.cover} 
                        alt={item.name} 
                        className="w-8 h-10 object-cover rounded flex-shrink-0" 
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-base font-text transition-colors duration-200 ${
                  location.pathname === link.to 
                    ? "bg-teal-900 text-yellow-400" 
                    : "text-white hover:bg-teal-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile User Section */}
          <div className="pt-4 border-t border-teal-600">
            {isLoggedIn ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center px-4 py-2 bg-teal-900 rounded-lg">
                  <div className="w-12 h-12 rounded-full ring-2 ring-yellow-400 flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
                    {avatar_url ? (
                      <img src={avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-yellow-400 w-full h-full flex items-center justify-center text-teal-700 font-bold text-lg">
                        {full_name ? full_name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-text text-white font-semibold">{full_name || "User"}</div>
                    <div className="text-sm text-gray-300">{user?.email}</div>
                  </div>
                </div>
                
                {/* User Actions */}
                <div className="space-y-1">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-3 text-base font-text text-white hover:bg-teal-700 rounded-lg transition-colors duration-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-base font-text text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4">
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-teal-700 px-6 py-3 rounded-lg font-text font-semibold transition-colors duration-200"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;