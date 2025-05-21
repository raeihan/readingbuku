import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../SupaClient";
import { useQuery } from "react-query";
import Header from "../home/Header";
import AuthorCard from "../daisyui/AuthorCard";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const AllAuthor = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

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

  const { data: authors = [], isLoading: isDataLoading } = useQuery({
    queryKey: ["author"],
    queryFn: async () => {
      const res = await supabase.from("author").select().order("id");
      return res.data || [];
    },
  });

  const countries = ["All", ...new Set(authors.map((author) => author.born))];

  const filteredAuthors =
    selectedCountry === "All"
      ? authors
      : authors.filter((author) => author.born === selectedCountry);

  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAuthors = filteredAuthors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">Loading ReadingBuku...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Author</title>
        <meta name="description" content="This page contain all products" />
        <meta name="keywords" content="Wonderful Shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
      <Header />
      <motion.div 
        className="px-4 py-6 md:p-8 font-text max-w-7xl mx-auto min-h-screen"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-text text-black">
          <h2 className="text-2xl md:text-3xl font-bold">All Authors</h2>
          <div className="w-full sm:w-auto">
            <select
              className="select select-bordered w-full bg-white text-black"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter authors by country"
            >
              {countries.map((country, idx) => (
                <option key={idx} value={country}>
                  {country === "All" ? "All Countries" : country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredAuthors.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''}
            {selectedCountry !== "All" ? ` from ${selectedCountry}` : ''}
          </p>
        )}

        {isDataLoading ? (
          <div className="flex justify-center my-10">
            <span className="loading loading-bars loading-md"></span>
          </div>
        ) : currentAuthors.length === 0 ? (
          <div className="text-center my-10 p-6 bg-gray-100 rounded-lg shadow-sm">
            <p className="text-lg font-medium">No authors found from {selectedCountry}</p>
            <button 
              onClick={() => setSelectedCountry("All")}
              className="mt-4 btn btn-sm btn-primary"
            >
              Show All Authors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 md:mt-10">
            {currentAuthors.map((item) => (
              <Link
                key={item.id}
                to={`/authorpages/${item.name}`}
                className="block transition-transform hover:scale-105"
              >
                <AuthorCard
                  profile_author={item.profile_author}
                  name={item.name}
                  born={item.born}
                  bio={item.bio}
                />
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && filteredAuthors.length > 0 && (
          <div className="flex justify-center pt-8 pb-12 overflow-x-auto">
            <div className="join flex-wrap gap-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <input
                  key={index}
                  type="radio"
                  name="pagination"
                  aria-label={`${index + 1}`}
                  onClick={() => setCurrentPage(index + 1)}
                  className="join-item btn btn-sm md:btn-md btn-square bg-white text-black border-0 hover:bg-gray-200"
                  checked={currentPage === index + 1}
                  readOnly
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AllAuthor;