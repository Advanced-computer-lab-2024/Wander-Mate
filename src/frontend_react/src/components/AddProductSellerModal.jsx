import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Icon } from "@iconify/react";
import  toast,{ Toaster } from "react-hot-toast";

const AddProductSellerModal = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Price: "",
    Description: "",
    Quantity: "",
    picture: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    // Get Seller ID from sessionStorage when the component mounts
    const storedSellerId = sessionStorage.getItem("sellerId");
    if (storedSellerId) {
      setSellerId(storedSellerId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "picture" && files) {
      setFormData((prev) => ({
        ...prev,
        picture: files[0],
      }));

      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const submitData = new FormData();
    submitData.append("Name", formData.Name);
    submitData.append("Price", formData.Price);
    submitData.append("Description", formData.Description);
    submitData.append("Quantity", formData.Quantity);
    submitData.append("picture", formData.picture);
  
    const createProduct = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");
  
        const { userID } = await reply.json();
        const sellerId = userID;
        submitData.append("Seller", sellerId);
  
        const response = await fetch("http://localhost:8000/addProductseller", {
          method: "POST",
          body: submitData,
        });
  
        if (!response.ok) {
          throw new Error("Error adding product.");
        }
  
        return response.json(); // Assuming the server sends a success response with data
      } catch (error) {
        console.error("Error:", error);
        throw error; // Ensures the error propagates to the toast.error handler
      }
    };
  
    toast.promise(
      createProduct(),
      {
        loading: "Adding product...",
        success: "Product added successfully!",
        error: "Failed to add product.",
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 5000,
          icon: "🎉",
        },
      }
    ).then(() => {
      setFormData({
        Name: "",
        Price: "",
        Description: "",
        Quantity: "",
        picture: null,
      });
      setPreviewImage(null);
      setIsOpen(false);
      window.location.reload();
    });
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Product</Button>
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
        size="full"
      >
        <Toaster />
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0 z-10"
            onClick={() => setIsOpen(false)}
          >
            <Icon icon="ph:x" className="h-4 w-4" />
          </Button>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-6 p-6">
              {/* Image Upload Section */}
              <div
                className="flex-shrink-0 w-full lg:w-[250px] h-auto relative overflow-hidden rounded-lg bg-gray-200 flex justify-center items-center cursor-pointer"
                onClick={() => document.getElementById("picture").click()}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500">Click to upload image</p>
                )}
              </div>

              {/* File Input - Hidden and Triggered by Clicking the Image Preview Area */}
              <Input
                id="picture"
                name="picture"
                type="file"
                accept="image/*"
                required
                onChange={handleInputChange}
                style={{ display: "none" }}
              />

              {/* Form Fields */}
              <div className="flex flex-col w-full space-y-6">
                <div className="space-y-2">
                  <Label>Product Name:</Label>
                  <Input
                    id="Name"
                    name="Name"
                    placeholder="Product Name"
                    required
                    value={formData.Name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price:</Label>
                  <Input
                    id="Price"
                    name="Price"
                    placeholder="Product Price"
                    type="number"
                    required
                    value={formData.Price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description:</Label>
                  <Textarea
                    id="Description"
                    name="Description"
                    placeholder="Product Description"
                    required
                    value={formData.Description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantity:</Label>
                  <Input
                    id="Quantity"
                    name="Quantity"
                    placeholder="Quantity"
                    type="number"
                    required
                    value={formData.Quantity}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Product
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductSellerModal;
