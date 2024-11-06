"use client";

import { useEffect, useState } from "react";
import FileUploaderMultiple from "../components/uploadDocs";
import { useNavigate } from "react-router-dom";
import auth3Light from "../public/images/auth/auth3-light.png";
import auth3Dark from "../public/images/auth/auth3-dark.png";
const UploadDocs = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [httpRequest, setHttp] = useState("");
  useEffect(() => {
    const fetchId = async () => {
      const username = sessionStorage.getItem("username");
      if (!username) {
        navigate("*");
      } else {
        try {
          const response = await fetch(
            `http://localhost:8000/getID/${username}`
          );
          if (response.status === 200) {
            const { userID } = await response.json();

            setUserId(userID);
          } else {
            navigate("*");
          }
        } catch {
          navigate("*");
        }
      }
    };
    const fetchHttp = () => {
      const type = sessionStorage.getItem("Type");
      if (!type) {
        navigate("*");
      } else {
        switch (type) {
          case "Seller":
            setHttp("http://localhost:8000/uploadSellerDocuments");
            break;
          case "Advertiser":
            setHttp("http://localhost:8000/uploadAdvertiserDocuments");
            break;
          case "TourGuide":
            setHttp("http://localhost:8000/uploadTourGuideDocuments");
            break;
          default:
            navigate("*");
        }
      }
    };
    fetchHttp();
    console.log(userId);
    fetchId();
  });
  return (
    <div className="loginwrapper  flex justify-center items-center relative overflow-hidden">
      <img
        src={auth3Dark}
        alt="background"
        className="absolute top-0 left-0 w-full h-full light:hidden"
      />
      <img
        src={auth3Light}
        alt="background"
        className="absolute top-0 left-0 w-full h-full dark:hidden"
      />
      <div className="w-full bg-background   py-5 max-w-xl  rounded-xl relative z-10 2xl:p-16 xl:p-12 p-10 m-4 ">
        <FileUploaderMultiple ownerId={userId} httpRequest={httpRequest} />
      </div>
    </div>
  );
};

export default UploadDocs;
