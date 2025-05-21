import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { supabase } from "../SupaClient";
import Header from "../home/Header";
import Card from "../daisyui/Card";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const Detail = () => {
  const { book_name } = useParams();
  const navigate = useNavigate();
  const [showFullBio, setShowFullBio] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const { data: bookData, isLoading: bookLoading } = useQuery({
    queryKey: ["book", book_name],
    queryFn: async () => {
      const res = await supabase
        .from("book")
        .select()
        .eq("book_name", book_name)
        .single();
      return res.data;
    },
  });

  const { data: authorData, isLoading: authorLoading } = useQuery({
    queryKey: ["author", bookData?.writer],
    queryFn: async () => {
      if (!bookData?.writer) return null;
      const res = await supabase
        .from("author")
        .select()
        .eq("name", bookData.writer)
        .single();
      return res.data;
    },
    enabled: !!bookData?.writer,
  });

  const { data: authorBooks, isLoading: authorBooksLoading } = useQuery({
    queryKey: ["authorBooks", bookData?.writer],
    queryFn: async () => {
      if (!bookData?.writer) return [];
      const res = await supabase
        .from("book")
        .select()
        .eq("writer", bookData.writer)
        .neq("book_name", book_name);
      return res.data;
    },
    enabled: !!bookData,
  });

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

  if (bookLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <span className="loading loading-bars loading-md text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Loading book...
        </p>
      </div>
    );

  if (!bookData)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
          Book not found
        </p>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Detail - {bookData.book_name}</title>
        <meta
          name="description"
          content={`Details about ${bookData.book_name} by ${bookData.writer}`}
        />
        <meta
          name="keywords"
          content={`${bookData.book_name}, ${bookData.writer}, books, reading`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
      <Header />
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-8 font-text"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
      >
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-colorback rounded-lg transition-colors shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Cover and Info Section - Left Side on Desktop */}
          <div className="w-full lg:w-1/4 flex flex-col">
            <div className="flex justify-center lg:justify-start">
              <img
                src={bookData.cover_book}
                className="h-64 sm:h-80 object-cover shadow-lg rounded"
                alt={bookData.book_name}
              />
            </div>
            <h2 className="text-black dark:text-white mt-6 text-xl sm:text-2xl font-semibold text-center lg:text-left">
              {bookData.book_name}
            </h2>
            <h3 className="text-black dark:text-white text-center lg:text-left">
              {bookData.writer}
            </h3>
            <hr className="my-4 border-zinc-300 dark:border-zinc-600" />
            <div className="dark:text-white text-black font-light space-y-3 text-sm sm:text-base text-center lg:text-left">
              <p>
                {bookData.pages} pages, {bookData.format}
              </p>
              <p>First published {bookData.published_date}</p>
              <p>Published by {bookData.publisher}</p>
              <p>ISBN: {bookData.isbn}</p>
            </div>
          </div>

          {/* Book Details and Author Info - Right Side on Desktop */}
          <div className="w-full lg:w-3/4 dark:text-white text-black mt-8 lg:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {bookData.book_name}
            </h1>
            <h2 className="text-lg py-2">{bookData.writer}</h2>

            <div className="mt-6">
              <h2 className="text-xl font-bold">Synopsis</h2>
              <p className="mt-2">
                {showFullDescription
                  ? bookData.synopsis
                  : bookData.synopsis.slice(0, 200) +
                    (bookData.synopsis.length > 200 ? "..." : "")}
              </p>
              {bookData.synopsis.length > 200 && (
                <button
                  className="text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 mt-2 transition-colors duration-200"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "See Less" : "See More"}
                </button>
              )}
            </div>

            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />

            {/* Author Section */}
            <div
              onClick={() => navigate(`/authorpages/${authorData?.name}`)}
              className="rounded-lg p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer">
                {authorLoading ? (
                  <span className="loading loading-spinner loading-sm text-teal-500"></span>
                ) : (
                  <img
                    className="w-20 h-20 rounded-full object-cover mx-auto sm:mx-0"
                    src={authorData?.profile_author}
                    alt={authorData?.name}
                  />
                )}
                <div className="text-center sm:text-left">
                  <h4 className="text-lg font-bold">{authorData?.name}</h4>
                  <p>{authorBooks?.length} books</p>
                </div>
              </div>
              <p className="mt-4">
                {showFullBio
                  ? authorData?.bio || "Biography not available."
                  : (authorData?.bio?.slice(0, 100) ||
                      "Biography not available.") +
                    (authorData?.bio?.length > 100 ? "..." : "")}
              </p>
              {authorData?.bio?.length > 100 && (
                <button
                  className="text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 mt-2 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullBio(!showFullBio);
                  }}
                >
                  {showFullBio ? "See Less" : "See More"}
                </button>
              )}
            </div>

            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />

            {/* Other Books Section */}
            <h3 className="text-xl sm:text-2xl font-semibold">
              Other books by {bookData.writer}
            </h3>

            {authorBooksLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-bars loading-md text-teal-500"></span>
              </div>
            ) : authorBooks?.length === 0 ? (
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No other books found
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mt-6">
                {authorBooks?.map((item) => (
                  <Card
                    key={item.id}
                    book_name={item.book_name}
                    cover_book={item.cover_book}
                    writer={item.writer}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Detail;
