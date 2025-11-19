import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
const HomeSlider = () => {
  return (
    <div className="homeSlider py-3 sm:py-4">
      <div className="container px-4 sm:px-6 overflow-hidden">
        <Swiper
          spaceBetween={10}
          navigation={true}
          loop={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="sliderHome"
        >
          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://nhaxinh.com/wp-content/uploads/2025/09/banner.jpg"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://nhaxinh.com/wp-content/uploads/2025/05/lifestyle-decor.webp"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://nhaxinh.com/wp-content/uploads/2025/06/SOFA-MAY.webp"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://nhaxinh.com/wp-content/uploads/2025/08/mb-nha-xinh-luong-yen-1400x755.webp"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://nhaxinh.com/wp-content/uploads/2025/09/den-5-nha-xinh-1536x1034.jpg"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://nhaxinh.com/wp-content/uploads/2025/08/banner-1536x1055.jpg"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
