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
        <SwiperSlide className="relative overflow-hidden bg-gray-100">
          <img 
            src="./international.png" 
            className="w-full h-full object-cover" 
            alt="International books" 
          />
        </SwiperSlide>
        <SwiperSlide className="relative overflow-hidden bg-gray-100">
          <img 
            src="./internationalbook.png" 
            className="w-full h-full object-cover" 
            alt="Test book" 
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;