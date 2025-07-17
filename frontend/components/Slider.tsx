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
        navigation
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        centeredSlides={true}
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        slidesPerView={1}
        spaceBetween={0}
        speed={2000}
        style={{
          width: "800px", // fixed container width
          height: "600px", // fixed container height
        }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
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
              alt={`slide ${index + 1}`}
              height={600}
              src={img}
              style={{
                objectFit: "fill",
              }}
              width={800}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
