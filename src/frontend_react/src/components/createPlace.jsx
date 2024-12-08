import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const CreatePlace = () => {
  const [formData, setFormData] = useState({
    Username: "",
    Name: "",
    Description: "",
    Location: "",
    OpeningHours: "",
    TicketPrices: "",
    Category: "",
    pictures: [],
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const mapRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("http://localhost:8000/getCategories");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Could not load categories. Please try again later.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTags = async () => {
    try {
      setLoadingTags(true);
      const response = await fetch("http://localhost:8000/readHistoricalTags");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Could not load tags. Please try again later.");
    } finally {
      setLoadingTags(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: Array.from(files),
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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();

    for (const key in formData) {
      if (key === "Location") {
        const [lat, lng] = formData[key].split(",").map(Number);
        submitData.append(
          "Location",
          JSON.stringify({
            type: "Point",
            coordinates: [lng, lat],
          })
        );
      } else if (key === "pictures") {
        formData[key].forEach((file) => {
          submitData.append("pictures", file);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    }

    submitData.append("Categories", JSON.stringify(selectedCategories));
    submitData.append("Tags", JSON.stringify(selectedTags));

    try {
      const response = await fetch("http://localhost:8000/createPlace", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        toast.success("Place created successfully!");
        setFormData({
          Username: "",
          Name: "",
          Description: "",
          Location: "",
          OpeningHours: "",
          TicketPrices: "",
          Category: "",
          pictures: [],
        });
        setSelectedCategories([]);
        setSelectedTags([]);
        setIsOpen(false);
      } else {
        toast.error("Error creating place.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create place.");
    }
  };

  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Create New Place</Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          size="full"
        >
          <div className="relative">
            <Button
              variant="ghost"
              className="absolute right-0 top-0 z-10"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon="ph:x" className="h-4 w-4" />
            </Button>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">
                        Image preview will appear here
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <Input
                    id="Name"
                    name="Name"
                    placeholder="Place Name"
                    required
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold"
                  />

                  <div className="space-y-2">
                    <Label>Location:</Label>
                    <Input
                      id="Location"
                      name="Location"
                      placeholder="Location"
                      required
                      readOnly
                      value={formData.Location}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Categories:</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                      {categories.map((category) => (
                        <div
                          key={category._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`category_${category._id}`}
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => handleCategoryChange(category._id)}
                            className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`category_${category._id}`}
                            className="text-sm font-medium"
                          >
                            {category.Name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags:</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                      {tags.map((tag) => (
                        <div
                          key={tag._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`tag_${tag._id}`}
                            checked={selectedTags.includes(tag._id)}
                            onChange={() => handleTagChange(tag._id)}
                            className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`tag_${tag._id}`}
                            className="text-sm font-medium"
                          >
                            {tag.Name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ticket Prices:</Label>
                    <Input
                      id="TicketPrices"
                      name="TicketPrices"
                      placeholder="Ticket Prices"
                      required
                      value={formData.TicketPrices}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Place Description:</Label>
                    <Textarea
                      id="Description"
                      name="Description"
                      placeholder="Describe this place"
                      required
                      value={formData.Description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Opening Hours:</Label>
                    <Input
                      id="OpeningHours"
                      name="OpeningHours"
                      placeholder="e.g., 9 AM - 5 PM"
                      required
                      value={formData.OpeningHours}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Pictures:</Label>
                    <Input
                      id="pictures"
                      name="pictures"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Place
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      {/* <TourismGovernerFooter /> */}
    </React.Fragment>
  );
};

export default CreatePlace;
