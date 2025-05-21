import React from "react";

const AuthorCard = ({ name, profile_author, born }) => {
  return (
    <div className="card card-compact font-text text-black dark:text-white">
      <figure>
        <img src={profile_author} className="w-44 h-44 object-cover rounded-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-base">{name}</h2>
        <p>{born}</p>
      </div>
    </div>
  );
};

export default AuthorCard;