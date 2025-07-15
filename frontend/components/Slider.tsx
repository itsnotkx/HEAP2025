"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider() {
  return (
    <div className="w-full flex justify-center">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        centeredSlides={true}
        slidesPerView={1}
        speed={2000}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        style={{
          width: "800px",   // fixed container width
          height: "600px",  // fixed container height
        }}
      >
        {/** Wrap each image in a div to make layout easier */}
        {[
          "/images/sg_luge.png",
          "/images/sg_rollercoaster.png",
          "/images/sg_zoo.png",
          "/images/sg_nightclub.png",
        ].map((img, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundColor: "#000", // Optional: dark background
            }}
          >
     
            <Image
              src={img}
              alt={`slide ${index + 1}`}
              width={800}
              height={600}
              style={{
                objectFit: "fill",
              }}
            />

          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}