import React, { useEffect, useState } from "react";
import NavigationMenuBar from "../components/NavigationMenuBar";
import CommentForm from "../forms/commentForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const CommentPage = () => {
  const [commentFormData, setCommentFormData] = useState({
    guideID: "",
    comment: "",
  });
  const navigate = useNavigate();
  const handleFormDataChange = (newFormData) => {
    console.log("Form data changed:", newFormData);
    setCommentFormData(newFormData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Retrieve userID from sessionStorage
    // const userID = sessionStorage.getItem("userId");
    const userID = "67325d260b78167e4249db6c";
    console.log("Retrieved UserID:", userID);

    try {
      const response = await axios.post(
        `http://localhost:8000/commentOnGuide/${userID}`,
        {
          guideID: commentFormData.guideID,
          text: commentFormData.comment,
        }
      );
      //   displayResults(response.data);
      alert("Comment Registered Succesfully ");
      navigate("/touristHomepage");
    } catch (error) {
      console.error("Error registering comment", error);
      alert(
        "Error registering comment: " + (error.response?.data || error.message)
      );
    }
  };

  return (
    <React.Fragment>
      <NavigationMenuBar />
      <h1 className="m-5">Comment Page</h1>
      <CommentForm
        formData={commentFormData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleSubmit}
      />
      <TourismGovernerFooter />
    </React.Fragment>
  );
};

export default CommentPage;
