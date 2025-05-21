const Left = () => {
  return (
    <div className="flex flex-col w-72">
      <div>
        <div className="dark:text-white text-black">
          <img src="./cover.png" className="h-80" />
          <h2 className="my-6 text-2xl font-semibold">Holy Mother</h2>
          <h3>Akiyoshi Rikako</h3>
          <button className="btn bg-teal-700 text-white border-hidden my-6 w-52 hover:bg-teal-900 text-lg font-thin">
            Read It
          </button>
        </div>
        <hr className="my-2 border-zinc-600" />
        <div className="dark:text-white text-black font-extralight">
          <h3 className="my-7">284 pages, Paperback</h3>
          <h3 className="my-7">First published September 1, 2015</h3>
          <h3 className="my-7">Published October 20, 2016 by Haru</h3>
          <h3 className="my-7">ISBN : 978-602-53858-1-0</h3>
        </div>
      </div>
    </div>
  );
};

export default Left;
