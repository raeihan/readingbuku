import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../SupaClient";
import { useQuery } from "react-query";
import AuthorCard from "../daisyui/AuthorCard";

const Author = () => {
  const { data: getProduct, isLoading } = useQuery({
    queryKey: ["author"],
    queryFn: async () => {
      const res = await supabase.from("author").select().order("id")
      return res.data;
    },
  });
  
  return (
    <div className="my-6 sm:my-8 md:my-10 font-text">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 md:pb-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold relative">
          <span className="relative inline-block">
            Author
            <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-yellow-400 rounded-full"></span>
          </span>
        </h2>
        <div className="text-sm sm:text-base hover:text-teal-700 dark:hover:text-teal-400 transition duration-300">
          <Link to={"/author"} className="flex items-center">
            <span>See More</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-6 md:mt-8">
        {isLoading ? (
          <div className="flex justify-center col-span-full py-10">
            <span className="loading loading-bars loading-md text-teal-700 dark:text-teal-400"></span>
          </div>
        ) : getProduct?.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No authors available at the moment</p>
          </div>
        ) : (
          getProduct?.slice(0, 5).map((item) => (
            <Link 
              key={item.id} 
              to={`/authorpages/${item.name}`} 
              className="block transform transition duration-300 hover:scale-105 hover:shadow-md rounded-lg overflow-hidden"
            >
              <AuthorCard
                profile_author={item.profile_author}
                name={item.name}
                born={item.born}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Author;