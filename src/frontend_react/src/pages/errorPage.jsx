import React from "react";
import { Button } from "../components/ui/button";
// import { useTheme } from "react-jss";
import { useNavigate } from "react-router-dom";
import lightImage from "../public/images/error/light-401.png";
import darkImage from "../public/images/error/dark-401.png";
const ErrorPage = () => {
  //   const { theme } = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/loginPage");
  };

  return (
    <div className="min-h-screen overflow-y-auto flex justify-center items-center p-10">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[542px]">
          <img
            // src={
            //   theme === "dark"
            //     ? "../public/images/error/dark-401.png"
            //     : "../public/images/error/light-401.png"
            // }
            src={lightImage}
            alt="error image"
            className="w-full h-21 object-cover"
          />
        </div>
        <div className="mt-16 text-center">
          <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-default-900">
            You are not Authorized
          </div>
          <div className="mt-3 text-default-600 text-sm md:text-base">
            You are missing the required rights to be able to access <br /> this
            page
          </div>
          <Button
            className="mt-9  md:min-w-[300px]"
            size="lg"
            onClick={handleClick}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
