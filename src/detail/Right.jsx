import React from "react";

const Right = () => {
  return (
    <>
      <div className="max-w-3xl mx-auto dark:text-white text-black">
        <h1 className="text-3xl font-bold  ">Holy Mother</h1>
        <h2 className="text-lg py-4">Akiyoshi Rikako</h2>
        <h2 className="mt-2 text-xl font-bold ">Genre</h2>
        <p className=" mt-4">
          There was a gruesome murder of a young boy in the town where Honami
          lived. The victim was even raped after being killed. The news made
          Honami fear for the safety of the only daughter she had. She couldn't
          even trust the police. What will she do to protect her only daughter?
        </p>
        <hr className="my-6 border-zinc-600" />
        <h3 className="text-2xl font-semibold ">Author</h3>
        <div className="flex items-center mt-4 ">
          <img
            className="w-20 h-20 rounded-full border"
            src="./akiyoshi.jpg"
            alt="Author"
          />
          <div className="ml-4">
            <h4 className="text-lg font-bold">Akiyoshi Rikako</h4>
            <p className="">23 books</p>
          </div>
        </div>
        <p className=" mt-4">
          Rikako Akiyoshi (in Japanese,{" "}
          <span className="font-bold">秋吉 理香子</span>) studied literature at
          Waseda University and received her Master’s degree in Film and TV
          Production from Loyola Marymount University. Her debut work{" "}
          <em>Snow Flower</em> won the Yahoo! JAPAN literature prize and was
          adapted into a short film. She is the author of several works of
          fiction. <em>The Dark Maidens</em> has also been adapted into a movie.
        </p>
        <hr className="my-6 border-zinc-600" />
        <h3 className="text-2xl font-semibold ">You might also like</h3>
      </div>
    </>
  );
};

export default Right;
