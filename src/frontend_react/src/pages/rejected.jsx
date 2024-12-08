"use client";
import lightImage from "../public/images/error/light-403.png";
import darkImage from "../public/images/error/dark-403.png";
import { Button } from "../components/ui/button";
import { useTheme } from "next-themes";
import TourismGovernerFooter from "../components/tourismGovernerFooter";
import React from "react";

const Rejected = () => {
  const { theme } = useTheme();
  return (
    <React.Fragment>
      <div className="min-h-screen  overflow-y-auto flex justify-center items-center p-10">
        <div className="w-full flex flex-col items-center">
          <div className="max-w-[542px]">
            <img
              src={theme === "dark" ? darkImage : lightImage}
              alt="error image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-16 text-center">
            <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-default-900">
              Ops! Access Denied
            </div>
            <div className="mt-3 text-default-600 text-sm md:text-base">
              Sadly the admin has rejected your use of the system <br /> you can
              try again by registering again!
            </div>
            <Button asChild className="mt-9  md:min-w-[300px]" size="lg">
              <a href="/">Go to Homepage</a>
            </Button>
          </div>
        </div>
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default Rejected;
