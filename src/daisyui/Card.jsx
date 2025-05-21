import React from "react";

const Card = ({book_name, cover_book, writer}) => {
  return (
    <div className="w-52 card card-compact font-text text-black dark:text-white">
      <figure>
        <img
          src={cover_book}
          className="h-64 w-auto object-cover p-2"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-base">{book_name}</h2>
        <p>{writer}</p>
      </div>
    </div>
  );
};

export default Card;
