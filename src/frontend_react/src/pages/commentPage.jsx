import React, { useState } from "react";
import NavigationMenuBar from "../components/NavigationMenuBar";
import CommentForm from "../forms/commentForm";
import axios from "axios";

const CommentPage = () => {
  const [commentFormData, setCommentFormData] = useState({
    guideID: "",
    comment: "",
  });
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
      <h1>Comment Page</h1>
      <CommentForm
        formData={commentFormData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleSubmit}
      />
    </React.Fragment>
  );
};

export default CommentPage;
