"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Slider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      centeredSlides={true}
      slidesPerView={1}
      speed={2000}
      autoplay={{
        delay:4000,
        disableOnInteraction: false,
      }}
      navigation
      pagination={{ clickable: true }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide><Image src="/images/sg_luge.png" alt="slide 1" width={800} height={600} style={{ objectFit: 'contain' }}></Image></SwiperSlide>
      <SwiperSlide><Image src="/images/sg_rollercoaster.png" alt="slide 2" width={800} height={600}></Image></SwiperSlide>
      <SwiperSlide><Image src="/images/sg_zoo.png" alt="slide 3" width={800} height={600}></Image></SwiperSlide>
      <SwiperSlide><Image src="/images/sg_nightclub.png" alt="slide 4" width={800} height={600}></Image></SwiperSlide>
    </Swiper>
  );
}
