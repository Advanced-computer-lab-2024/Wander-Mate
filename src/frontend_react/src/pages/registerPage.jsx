import React from "react";
import bg from "../public/images/auth/bg-2.jpg";
import slider1 from "../public/images/auth/slide-1.png";
import slider2 from "../public/images/auth/slide-2.png";
import slider3 from "../public/images/auth/slide-3.png";
// import RegForm from "./register";
import Registeration from "../components/registeration";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useThemeStore } from "../store";

const RegisterPage = () => {
  const { isRtl } = useThemeStore();

  return (
    <div className="loginwrapper bg-background flex items-center min-h-screen overflow-hidden w-full">
      <div className="lg-inner-column grid grid-cols-2 w-full justify-center overflow-y-auto p-4">
        <div
          className="col-span-1 h-full w-full bg-no-repeat bg-center bg-cover hidden lg:block rounded-xl"
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
                <img src={slider1} alt="Slide 1" className="" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full h-full flex justify-center items-center">
                <img src={slider2} alt="Slide 2" className="" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full h-full flex justify-center items-center">
                <img src={slider3} alt="Slide 3" className="" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="px-4 py-4 flex justify-center items-center col-span-2 lg:col-span-1">
          <div className="sm:w-[480px] w-full">
            <Registeration />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;