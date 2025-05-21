import React, { useState, useEffect } from "react";
import Header from "../home/Header";
import Carousel from "../home/Carousel";
import Novel from "../home/Novel";
import Comic from "../home/Comic";
import Author from "../home/Author";
import Footer from "../home/Footer";
import { motion } from "framer-motion";

const Home = () => {
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-colorback dark:bg-gray-900">
        <span className="loading loading-bars loading-lg text-yellow-400"></span>
        <p className="mt-4 text-teal-700 dark:text-teal-400 font-medium">
          Loading ReaBuk...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Meta information would go here in a real implementation */}
      <Header />
      <motion.div
        className="px-3 py-4 sm:px-6 md:px-8 lg:px-10 text-black dark:text-white max-w-7xl mx-auto"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
      >
        <Carousel />
        <Novel />
        <Comic />
        <Author />
      </motion.div>
      <Footer />
    </>
  );
};

export default Home;