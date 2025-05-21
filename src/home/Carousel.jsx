import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

const Carousel = () => {
  return (
    <div className="mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 rounded-lg overflow-hidden shadow-lg">
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        navigation={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Navigation, Autoplay]}
        className="w-full h-48 sm:h-56 md:h-72 lg:h-96 rounded-lg"
      >
        <SwiperSlide className="flex justify-center items-center bg-white">
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            <img src="./international.png" className="object-contain max-h-full max-w-full" alt="International books" />
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex justify-center items-center bg-white">
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            <img src="./internationalbook.png" className="object-contain max-h-full max-w-full" alt="Test book" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;