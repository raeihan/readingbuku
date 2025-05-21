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
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const handleMyBooksClick = () => {
    navigate("/mybooks");
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if user is logged in
  const isLoggedIn = auth || localStorage.getItem("sb-ggigrakpmocwmzfyrzdi-auth-token");

  return (
    <header className="bg-teal-700 w-full sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="font-text text-white text-xl md:text-2xl">
                Reading<span className="text-yellow-400">Buku</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <nav className="flex space-x-8">
              <Link 
                to="/" 
                className={`text-white hover:text-yellow-400 px-3 py-2 text-base font-text ${location.pathname === "/" ? "text-yellow-400" : ""}`}
              >
                Home
              </Link>
              <Link 
                to="/library" 
                className={`text-white hover:text-yellow-400 px-3 py-2 text-base font-text ${location.pathname === "/library" ? "text-yellow-400" : ""}`}
              >
                Library
              </Link>
              <Link 
                to="/contact" 
                className={`text-white hover:text-yellow-400 px-3 py-2 text-base font-text ${location.pathname === "/contact" ? "text-yellow-400" : ""}`}
              >
                Contact
              </Link>
            </nav>
            
            {/* Search Bar */}
            <div className="search-container relative flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Search Your Book or Author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg px-4 py-2 text-gray-700 bg-gray-200 focus:outline-none"
              />
              {suggestions.length > 0 && (
                <div ref={suggestionRef} className="absolute top-12 w-full bg-white border border-gray-300 rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black flex items-center gap-2"
                      onClick={() => handleSelect(item)}
                    >
                      {item.cover && (
                        <img 
                          src={item.cover} 
                          alt={item.name} 
                          className="w-8 h-10 object-cover rounded" 
                        />
                      )}
                      <div>
                        {item.name} <span className="text-sm text-gray-500">({item.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <Theme />
            
            {/* User Profile */}
            {isLoggedIn ? (
              <div className="profile-dropdown relative ml-4">
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer flex items-center"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-yellow-400 flex items-center justify-center overflow-hidden">
                    {avatar_url ? (
                      <img 
                        src={avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-yellow-400 w-full h-full flex items-center justify-center text-teal-700 font-bold">
                        {full_name ? full_name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-text">{full_name || "User"}</p>
                    </div>
                    <button 
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={handleMyBooksClick}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Books
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-text"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-white hover:bg-teal-600 p-2 rounded-md"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-teal-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-text ${location.pathname === "/" ? "bg-teal-900 text-yellow-400" : "text-white hover:bg-teal-600"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/library"
            className={`block px-3 py-2 rounded-md text-base font-text ${location.pathname === "/library" ? "bg-teal-900 text-yellow-400" : "text-white hover:bg-teal-600"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Library
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md text-base font-text ${location.pathname === "/contact" ? "bg-teal-900 text-yellow-400" : "text-white hover:bg-teal-600"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {/* Mobile Search */}
          <div className="relative mt-3 search-container">
            <input
              type="text"
              placeholder="Search Your Book or Author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-gray-700 bg-gray-200"
            />
            {suggestions.length > 0 && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black flex items-center gap-2"
                    onClick={() => {
                      handleSelect(item);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.cover && <img src={item.cover} alt={item.name} className="w-8 h-10 object-cover rounded" />}
                    <div>
                      {item.name} <span className="text-sm text-gray-500">({item.type})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile navigation extra items */}
          <div className="py-3 flex items-center justify-between px-3 border-t border-teal-600">
            {/* Mobile Theme Toggle */}
            <Theme />
            {isLoggedIn ? (
              <div>
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full ring-2 ring-yellow-400 flex items-center justify-center overflow-hidden">
                      {avatar_url ? (
                        <img src={avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-yellow-400 w-full h-full flex items-center justify-center text-teal-700 font-bold">
                          {full_name ? full_name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-text text-white">{full_name || "User"}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      handleProfileClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-text text-white hover:bg-teal-600 rounded-md"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleMyBooksClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-text text-white hover:bg-teal-600 rounded-md"
                  >
                    My Books
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-text text-red-400 hover:bg-teal-600 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3">
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-text"
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