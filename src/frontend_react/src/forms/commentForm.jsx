import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Form } from "../components/ui/form";

const CommentForm = (props) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    props.onFormDataChange({ ...props.formData, [name]: value });
  };

  return (
    <React.Fragment>
      <Form>
        <div className="form-floating mb-3">
          <Input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="Enter Guide ID"
            name="guideID"
            onChange={handleChange}
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
