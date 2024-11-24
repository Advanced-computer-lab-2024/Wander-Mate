import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Form } from "../components/ui/form";
import Select from "react-select";
import { useEffect, useState } from "react";
import axios from "axios";
const CommentForm = (props) => {
  const [tourGuides, setTourGuides] = useState([]);

  useEffect(() => {
    const getTourGuides = async () => {
      try {
        // Fetch data from the API
        const response = await axios.get("http://localhost:8000/getTourguides");
        console.log("API Response:", response.data);
        console.log("Response Status:", response.status);

        // Map the data to the required format for Select
        const guidesArray = response.data.Creator;
        const formattedGuides = guidesArray.map((guide) => ({
          value: guide._id, // Replace with the correct field name for ID
          label: guide.Username, // Replace with the correct field name for username
        }));

        setTourGuides(formattedGuides); // Set state with formatted guides
        console.log(tourGuides);
      } catch (error) {
        console.error("Error fetching tour guides:", error.message);
        alert("Could not load tour guides. Please try again later.");
      }
    };

    getTourGuides();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    props.onFormDataChange({ ...props.formData, [name]: value });
  };
  const handleSelectChange = (selectedOption) => {
    props.onFormDataChange({
      ...props.formData,
      guideID: selectedOption?.value || "", // Update guideID with selected value
    });
  };

  return (
    <React.Fragment>
      <Form>
        <div className="form-floating mb-3">
          <Select
            placeholder="Select Tour Guide"
            name="guideID"
            options={tourGuides}
            onChange={handleSelectChange}
            value={
              tourGuides.find(
                (guide) => guide.value === props.formData.guideID
              ) || null
            }
          />
        </div>

        <div className="form-floating">
          <Textarea
            className="form-control"
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            style={{ height: "100px" }} // Corrected style prop
            name="comment"
            onChange={handleChange}
          ></Textarea>
        </div>
        <div className="text-center">
          <Button className="m-2" onClick={props.onSubmit}>
            Save
          </Button>
        </div>
      </Form>
    </React.Fragment>
  );
};

export default CommentForm;
