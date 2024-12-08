import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Icon } from "@iconify/react";
import User from "../public/images/User.png";

const RegisterUserPhoto = ({ onImageSelect }) => {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageSrc = URL.createObjectURL(file);
      setImageSrc(newImageSrc);
      if (onImageSelect) onImageSelect(file); // Pass the file to the parent component
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-[124px] h-[124px] relative rounded-full">
        <img
          src={imageSrc || User} // Placeholder image
          alt="avatar"
          className="w-full h-full object-cover rounded-full"
        />
        <Button
          asChild
          size="icon"
          className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0"
        >
          <Label htmlFor="avatar">
            <Icon
              className="w-5 h-5 text-primary-foreground"
              icon="heroicons:pencil-square"
            />
          </Label>
        </Button>
        <Input
          type="file"
          className="hidden"
          id="avatar"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default RegisterUserPhoto;
