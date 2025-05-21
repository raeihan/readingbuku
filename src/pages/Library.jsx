import React, { useState, useEffect } from "react";
import { supabase } from "../SupaClient";
import Card from "../daisyui/Card";
import { Link } from "react-router-dom";
import Header from "../home/Header";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Menu, X, BookOpen, BookType } from "lucide-react";

// Animation variants
const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

// SideBar Component with Responsive Toggle
const SideBar = ({ setFilterType, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [books, setBooks] = useState({ novels: 0, manga: 0 });

  useEffect(() => {
    const fetchBookCounts = async () => {
      try {
        const [novelsResult, mangaResult] = await Promise.all([
          supabase
            .from("book")
            .select("id", { count: "exact", head: true })
            .eq("type", "Novels"),
          supabase
            .from("book")
            .select("id", { count: "exact", head: true })
            .eq("type", "Manga, Comics")
        ]);

        if (novelsResult.error) console.error(novelsResult.error);
        if (mangaResult.error) console.error(mangaResult.error);

        setBooks({
          novels: novelsResult.count || 0,
          manga: mangaResult.count || 0
        });
      } catch (error) {
        console.error("Error fetching book counts:", error);
      }
    };

    fetchBookCounts();
  }, []);

  const buttonClass = "btn w-full justify-start text-left text-sm text-black dark:text-white bg-amber-400 hover:bg-amber-300 dark:bg-gray-800 dark:hover:bg-gray-700 border border-hidden";

  const handleFilterClick = (filter) => {
    setFilterType(filter);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  // Sidebar content that's reused in both mobile and desktop views
  const sidebarContent = (
    <nav className="flex flex-col flex-grow p-4 space-y-4">
      <button
        onClick={() => handleFilterClick("novel")}
        className={buttonClass}
      >
        <BookOpen size={18} className="mr-2" />
        Novels{" "}
        <span className="ml-2 text-sm text-white dark:text-gray-400">
          ({books.novels})
        </span>
      </button>
      <button
        onClick={() => handleFilterClick("manga/comic")}
        className={buttonClass}
      >
        <BookType size={18} className="mr-2" />
        Manga/Comic{" "}
        <span className="ml-2 text-sm text-white dark:text-gray-400">
          ({books.manga})
        </span>
      </button>
      <hr className="border-gray-700" />
      <button
        onClick={() => handleFilterClick(null)}
        className="btn w-full justify-start text-sm text-white bg-red-600 hover:bg-red-500 focus:bg-red-500 border border-hidden"
      >
        Reset Filter
      </button>
    </nav>
  );

  // Mobile menu overlay
  const mobileMenu = (
    <div className={`md:hidden fixed inset-0 z-50 ${isMobileMenuOpen ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className="absolute top-0 left-0 w-64 h-full bg-amber-100 dark:bg-gray-900 z-10 transform transition-transform duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-black dark:text-white">Book Categories</h2>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-6 w-6 text-black dark:text-white" />
          </button>
        </div>
        {sidebarContent}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Library</title>
        <meta name="description" content="This page contains all products" />
        <meta name="keywords" content="Wonderful Shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
      
      {/* Mobile sidebar menu */}
      {mobileMenu}
      
      {/* Desktop Sidebar - hidden on small screens */}
      <div className="hidden md:flex flex-col w-64 bg-amber-100 dark:bg-gray-900 text-black dark:text-white shadow-md font-text fixed h-screen">
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          Book Categories
        </div>
        {sidebarContent}
      </div>
    </>
  );
};

// Main Library Component
const Library = () => {
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(null);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("date");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsPerPage = 6;

  // Simulate loading with shorter duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Fetch books when filter or sort order changes
  useEffect(() => {
    if (!filterType) {
      setBooks([]);
      return;
    }

    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase
          .from("book")
          .select("*")
          .eq("type", filterType === "novel" ? "Novels" : "Manga, Comics")
          .order(sortOrder === "date" ? "year_published" : "book_name", {
            ascending: sortOrder === "asc" || sortOrder === "date",
          });

        if (error) {
          console.error("Error fetching books:", error);
          return;
        }

        setBooks(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [filterType, sortOrder]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  // Get title based on filter type
  const getTitle = () => {
    if (filterType === "novel") return "Novels";
    if (filterType === "manga/comic") return "Manga, Comics";
    return "Library Books";
  };

  // Empty state component when no filter is selected
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 my-6 md:my-12 bg-colorback dark:bg-gray-700 rounded-lg shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 text-amber-400 dark:text-amber-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-2 text-center">Please Select Book Category</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4 text-sm md:text-base">
        Please select a book category to view our book collection.
      </p>
    </div>
  );

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Loading ReadingBuku...
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <motion.div
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
        className="flex min-h-screen dark:bg-gray-800 text-gray-900 dark:text-white font-text"
      >
        <SideBar 
          setFilterType={setFilterType} 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        {/* Main content area with responsive padding */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto md:ml-64">
          {/* Mobile header with menu button */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h1 className="text-2xl font-semibold">{getTitle()}</h1>
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="btn btn-square btn-sm bg-amber-400 hover:bg-amber-300 dark:bg-gray-700 text-black dark:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          {/* Desktop header (hidden on mobile) */}
          <h1 className="hidden md:block text-3xl font-semibold mb-6">{getTitle()}</h1>
          
          {filterType ? (
            <>
              <select
                className="select select-bordered w-full max-w-xs p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="asc">Sort by Title: A-Z</option>
                <option value="desc">Sort by Title: Z-A</option>
              </select>
              
              {/* Responsive grid - 1 column on mobile, 2 on tablets, 3 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
                {currentBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/detail/${book.book_name}`}
                    className="block"
                  >
                    <Card
                      book_name={book.book_name}
                      cover_book={book.cover_book}
                      writer={book.writer}
                    />
                  </Link>
                ))}
              </div>

              {/* Responsive Pagination */}
              {totalPages > 0 && (
                <div className="flex justify-center pt-6 pb-4">
                  <div className="join overflow-x-auto max-w-screen-sm">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <input
                        key={index}
                        type="radio"
                        name="pagination"
                        aria-label={`${index + 1}`}
                        className="join-item btn btn-sm md:btn-md"
                        checked={currentPage === index + 1}
                        onChange={() => setCurrentPage(index + 1)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Library;