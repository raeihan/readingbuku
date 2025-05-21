import React, { useEffect, useState } from 'react'
import Header from '../home/Header'
import { Helmet } from 'react-helmet';
import { motion } from "framer-motion";

const MyBooks = () => {
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
          Loading ReadingBuku...
        </p>
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>Bookmark</title>
        <meta name="description" content="This page contain all products" />
        <meta name="keywords" content="Wonderful Shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
      </Helmet>
      <Header />
      <motion.div
        className="p-10 text-black dark:text-white"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
      >
        Bookmark
      </motion.div>
    </>
  );
}

export default MyBooks