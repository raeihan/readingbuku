import React from 'react'

const bio = () => {
  return (
    <div className="mx-auto flex gap-6">
      <img
        src="/akiyoshi.jpg" 
        className="w-56 h-w-56 rounded-lg object-cover border"
      />
      <div>
        <h2 className="text-black dark:text-white text-2xl font-bold">Akiyoshi Rikako</h2>
        <p className="text-lg text-black dark:text-white">Japan</p>
        <hr className="my-2 border-gray-400" />
        <p className="text-black dark:text-white">
          Rikako Akiyoshi (in Japanese, <span className="font-bold">秋吉 理香子</span>) studied literature at Waseda University and
          received her Master’s degree in Film and TV Production from Loyola Marymount University. Her debut work <em>Snow Flower </em>
          won the Yahoo! JAPAN literature prize and was adapted into a short film. She is the author of several works of fiction.
          <em> The Dark Maidens</em> has also been adapted into a movie.
        </p>
      </div>
    </div>
  )
}

export default bio