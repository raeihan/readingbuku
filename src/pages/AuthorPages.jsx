import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { supabase } from "../SupaClient";
import Header from "../home/Header";
import Card from "../daisyui/Card";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const AuthorPages = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Simulasi waktu loading dengan durasi singkat
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Durasi 500ms
    return () => clearTimeout(timer);
  }, []);

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const { data: authorData, isLoading: authorLoading } = useQuery({
    queryKey: ["author", name],
    queryFn: async () => {
      const res = await supabase
        .from("author")
        .select()
        .eq("name", name)
        .single();
      return res.data;
    },
  });

  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ["books", name],
    queryFn: async () => {
      const res = await supabase.from("book").select().eq("writer", name);
      return res.data;
    },
  });

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900 px-4">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium text-center">Loading ReadingBuku...</p>
      </div>
    );
  }

  if (authorLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <span className="loading loading-bars loading-md text-yellow-400"></span>
      <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium text-center">Loading author...</p>
    </div>
  );
  
  if (!authorData) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <p className="text-red-600 font-medium text-center">Author not found</p>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Author - {authorData.name}</title>
        <meta name="description" content={`Books by ${authorData.name}`} />
        <meta name="keywords" content={`${authorData.name}, books, author, ReadingBuku`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>

      <Header />

      <motion.div 
        className="py-8 px-4 sm:px-6 lg:px-8 font-text max-w-7xl mx-auto"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
      >
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-colorback rounded-lg transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Author Profile Section */}
        <div className="w-full flex flex-col sm:flex-row gap-6 mb-12">
          <div className="flex justify-center sm:justify-start">
            <img
              src={authorData.profile_author}
              className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg object-cover border shadow-md"
              alt={authorData.name}
            />
          </div>
          <div className="flex-1 mt-4 sm:mt-0">
            <h1 className="text-black dark:text-white text-2xl sm:text-3xl font-bold">
              {authorData.name}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
              {authorData.born}
            </p>
            <hr className="my-3 border-gray-300 dark:border-gray-700" />
            <p className="text-black dark:text-white text-sm sm:text-base">
              {authorData.bio}
            </p>
          </div>
        </div>

        {/* Books Section */}
        <div className="w-full bg-cream dark:bg-gray-800 py-6 px-4 sm:px-6 rounded-lg shadow-sm">
          <h2 className="text-black dark:text-white text-xl sm:text-2xl font-bold mb-6">
            {authorData.name}'s Books
          </h2>
          
          {booksLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-bars loading-md text-yellow-400"></span>
            </div>
          ) : books && books.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {books.map((item) => (
                <Card
                  key={item.id}
                  book_name={item.book_name}
                  cover_book={item.cover_book}
                  writer={item.writer}
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-600 dark:text-gray-400">
              No books found for this author.
            </p>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AuthorPages;