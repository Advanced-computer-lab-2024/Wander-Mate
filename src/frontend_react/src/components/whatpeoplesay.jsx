import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../assets/css/whatpeoplesay.css";
import photo1 from "../public/images/avatar/avatar-1.jpg";
import photo2 from "../public/images/avatar/avatar-2.jpg";
import photo3 from "../public/images/avatar/avatar-3.jpg";
import photo7 from "../public/images/avatar/avatar-4.jpg";
import photo8 from "../public/images/avatar/avatar-5.jpg";
import photo4 from "../public/images/files/back1.jpg";
import photo5 from "../public/images/files/sphinx.jpg";
import photo6 from "../public/images/files/mumbai.jpg";
import photo9 from "../public/images/files/ny.jpg";
import photo0 from "../public/images/files/jordan.jpg";

const WhatPeopleSay = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  return (
    <div className="relative w-full h-[835px] overflow-hidden bg-[#ECF1F0]">
      <h2 className="absolute left-1/2 transform -translate-x-1/2 top-[62px] font-['Open_Sans'] font-bold text-4xl text-center text-black">
        What People Say About Us
      </h2>
      <Slider {...settings} className="mt-[175px]">
        {/* Slide 1 */}
        <div>
          <div className="relative w-[1228px] h-[536px] mx-auto">
          <img src={photo4} alt="Testimonial background" className="w-full h-full object-cover rounded-[10px]" />

            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-84px] w-[738px] h-[250px] bg-white shadow-lg rounded-[20px] flex flex-col items-center justify-center p-8">
              <img
                src={photo1}
                alt="Profile Avatar 1"
                className="absolute -top-[83px] w-[148px] h-[148px] rounded-full border border-white"
              />
              <p className="font-['Poppins'] text-xl text-center text-black mt-12 mb-4">
              This platform has completely transformed how I plan my day! The intuitive design and helpful features make everything so simple and enjoyable.
              </p>
              <p className="font-['Poppins'] font-semibold text-2xl text-black">
                -Jane Doe
              </p>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div>
          <div className="relative w-[1228px] h-[536px] mx-auto">
          <img src={photo5} alt="Testimonial background" className="w-full h-full object-cover rounded-[10px]" />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-84px] w-[738px] h-[250px] bg-white shadow-lg rounded-[20px] flex flex-col items-center justify-center p-8">
              <img
                src={photo2}
                alt="Profile"
                className="absolute -top-[83px] w-[148px] h-[148px] rounded-full border border-white"
              />
              <p className="font-['Poppins'] text-xl text-center text-black mt-12 mb-4">
              I can't recommend this site enough! The seamless experience and outstanding customer support set it apart from the rest.
              </p>
              <p className="font-['Poppins'] font-semibold text-2xl text-black">
                -Jeo Stanlee
              </p>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div>
          <div className="relative w-[1228px] h-[536px] mx-auto">
          <img src={photo6} alt="Testimonial background" className="w-full h-full object-cover rounded-[10px]" />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-84px] w-[738px] h-[250px] bg-white shadow-lg rounded-[20px] flex flex-col items-center justify-center p-8">
              <img
                src={photo3}
                alt="Profile1"
                className="absolute -top-[83px] w-[148px] h-[148px] rounded-full border border-white"
              />
              <p className="font-['Poppins'] text-xl text-center text-black mt-12 mb-4">
              An absolute game-changer! Everything works perfectly, and the user-friendly interface makes it a pleasure to use every single time.
              </p>
              <p className="font-['Poppins'] font-semibold text-2xl text-black">
                -Michelle Smith
              </p>
            </div>
          </div>
        </div>
        {/* Slide 4*/}
        <div>
          <div className="relative w-[1228px] h-[536px] mx-auto">
          <img src={photo9} alt="Testimonial background" className="w-full h-full object-cover rounded-[10px]" />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-84px] w-[738px] h-[250px] bg-white shadow-lg rounded-[20px] flex flex-col items-center justify-center p-8">
              <img
                src={photo7}
                alt="Profile"
                className="absolute -top-[83px] w-[148px] h-[148px] rounded-full border border-white"
              />
              <p className="font-['Poppins'] text-xl text-center text-black mt-12 mb-4">
              Everything I needed in one place! The site is fast, responsive, and packed with great features.
              </p>
              <p className="font-['Poppins'] font-semibold text-2xl text-black">
                -Mohamed Ali
              </p>
            </div>
          </div>
        </div>
        {/* Slide 5*/}
        <div>
          <div className="relative w-[1228px] h-[536px] mx-auto">
          <img src={photo0} alt="Testimonial background" className="w-full h-full object-cover rounded-[10px]" />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-84px] w-[738px] h-[250px] bg-white shadow-lg rounded-[20px] flex flex-col items-center justify-center p-8">
              <img
                src={photo8}
                alt="Profile"
                className="absolute -top-[83px] w-[148px] h-[148px] rounded-full border border-white"
              />
              <p className="font-['Poppins'] text-xl text-center text-black mt-12 mb-4">
              Incredible experience! The attention to detail and ease of navigation truly stand out. Highly satisfied!
              </p>
              <p className="font-['Poppins'] font-semibold text-2xl text-black">
                -Rachel Zane
              </p>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default WhatPeopleSay;
