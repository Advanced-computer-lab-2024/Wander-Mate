import React from "react";
import "../assets/css/startPage.css"; // Import the CSS file
import MainNav from "../components/mainNav";
import OurAcheivementsBlock from "../components/OurAcheivementsBlock";
import OurService from "../components/OurServiceBlock";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();
  const handleRegClick = () => {
    navigate("/registerPage");
  };
  return (
    <>
      <MainNav targetId1="ourServiceSection" />
      <div className="frame">
        <div className="inner-container">
          <h1 className="title">QUALITY & PASSION</h1>
          <div className="buttonR">
            <span className="buttonR-text" onClick={handleRegClick}>
              Register Now
            </span>
          </div>
        </div>
      </div>
      <OurService id="ourServiceSection" />
      <OurAcheivementsBlock />
    </>
  );
};

export default StartPage;
