import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from '@radix-ui/react-label';
import { Icon } from "@iconify/react";
import { Button } from './ui/button';

const UserPhoto = ({ onImageSelect, isUploading, initialImage }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageSelect(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 relative">
      <label htmlFor="photo-upload" className="cursor-pointer">
        <div className="relative">
          <Avatar className="w-32 h-32 transition-opacity hover:opacity-80">
            <AvatarImage src={previewUrl || initialImage} alt="Profile" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <span className="text-white">Uploading...</span>
            </div>
          )}
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
        </div>
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <p className="text-sm text-gray-500">Click on the image to change your photo</p>
    </div>
  );
};

export default UserPhoto;
