import React from "react";
import bg from "../public/images/auth/bg-2.jpg";
import slider1 from "../public/images/auth/apple.png";
import slider2 from "../public/images/auth/slide-2.png";
import slider3 from "../public/images/auth/slide-3.png";
import LogInForm from "./login";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useThemeStore } from "../store";

const LoginPage = () => {
  const { isRtl } = useThemeStore();

  return (
    <div className="loginwrapper bg-background flex items-center min-h-screen overflow-hidden w-full">
      <div className="lg-inner-column grid lg:grid-cols-2 w-full flex-wrap justify-center p-4 overflow-y-auto">
        <div
          className="h-full w-full bg-no-repeat bg-center bg-cover hidden lg:block rounded-xl"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <Swiper
            key={`${isRtl}-swiper`}
            dir={isRtl ? "rtl" : "ltr"}
            navigation={{
              prevEl: ".prev",
              nextEl: ".next",
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="w-full h-full rounded-2xl auth-swiper"
            style={{
              "--swiper-pagination-color": "#fff",
              "--swiper-pagination-bottom": "40px",
              "--swiper-pagination-bullet-size": "10px",
            }}
          >
            <SwiperSlide>
              <div className="w-full h-full flex justify-center items-center">
                <img src={slider1} alt="Slider 1" className="" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full h-full flex justify-center items-center">
                <img src={slider2} alt="Slider 2" className="" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full h-full flex justify-center items-center">
                <img src={slider3} alt="Slider 3" className="" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="px-4 py-5 flex justify-center items-center">
          <div className="lg:w-[480px]">
            <LogInForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
