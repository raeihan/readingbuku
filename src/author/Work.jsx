import React from "react";
import Card from "../daisyui/Card";
import { useQuery } from "react-query";
import { supabase } from "../SupaClient";

const Work = () => {
    const { data: getProduct, isLoading } = useQuery({
        queryKey: ["book", "Novels"],
        queryFn: async () => {
          const res = await supabase.from("book").select().eq("writer", "Akiyoshi Rikako")
          return res.data;
        },
      });
  return (
    <div className="mx-auto bg-cream py-7">
      <h2 className="text-black dark:text-white text-2xl font-bold mb-4">
        Akiyoshi Rikako Books
      </h2>
      <div className="grid grid-cols-5 gap-4 mt-10 max-lg:grid-cols-1 max-lg:gap-2">
        {isLoading ? (
          <div className="flex justify-center col-span-4">
            <span className="loading loading-bars loading-md"></span>
          </div>
        ) : (
          getProduct?.slice(0, 5).map((item) => (
              <Card
                book_name={item.book_name}
                cover_book={item.cover_book}
                writer={item.writer}
              />
          ))
        )}
      </div>
    </div>
  );
};

export default Work;

