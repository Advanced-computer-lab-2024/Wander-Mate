import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";

import BasicMap from './ui/basic-map';

const CreatePlace = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Name: '',
    Description: '',
    Location: '',
    OpeningHours: '',
    pictures: [],
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [ticketPrices, setTicketPrices] = useState([]);
  const [newTicketType, setNewTicketType] = useState('');
  const [newTicketPrice, setNewTicketPrice] = useState('');

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
    if (name === 'pictures') {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        pictures: [...prev.pictures, ...newFiles],
      }));
      const newPreviewImages = newFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviewImages]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    console.log(selectedCategory);
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

    submitData.append('Category', selectedCategory);
    submitData.append('Tags', JSON.stringify(selectedTags));

    // Filter out any ticket prices with empty values and ensure correct format
    const validTicketPrices = ticketPrices
      .filter(([type, price]) => type && price !== null && price !== '')
      .map(([type, price]) => [type, Number(price)]);
    submitData.append('TicketPrices', JSON.stringify(validTicketPrices));

    const createPlacePromise = async () => {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get advertiser ID");
      const { userID } = await reply.json();

      submitData.append('Creator', userID);

      const response = await fetch("http://localhost:8000/createPlace", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Failed to create place");
      }
      setIsOpen(false);
      window.location.reload();
      return response.json();
    };

    toast.promise(
      createPlacePromise(),
      {
        loading: 'Creating place...',
        success: 'Place created successfully!',
        error: 'Error creating place.',
      },
      {
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 5000,
          icon: '🎉',
        },
      }
    );
    

    try {
      await createPlacePromise();
      setFormData({
        Username: '',
        Name: '',
        Description: '',
        Location: '',
        OpeningHours: '',
        Category: '',
        pictures: [],
      });
      setSelectedCategory('');
      setSelectedTags([]);
      setPreviewImages([]);
      setTicketPrices([]);
      setIsOpen(false);
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTicketPrice = () => {
    if (newTicketType && newTicketPrice) {
      setTicketPrices([...ticketPrices, [newTicketType, parseFloat(newTicketPrice)]]);
      setNewTicketType('');
      setNewTicketPrice('');
    }
  };

  const handleRemoveTicketPrice = (index) => {
    setTicketPrices(ticketPrices.filter((_, i) => i !== index));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>Create New Place</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" size="full">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon icon="ph:x" className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={handleImageClick}
                  >
                    <Icon icon="ph:image-square" className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload images</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    name="pictures"
                    onChange={handleInputChange}
                  />
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
                    <BasicMap
                      onLocationSelect={(lng, lat) => {
                        const locationString = `${lat},${lng}`;
                        setFormData((prev) => ({
                          ...prev,
                          Location: locationString,
                        }));
                      }}
                      initialLocation={
                        formData.Location
                          ? formData.Location.split(',').map(Number)
                          : undefined
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category:</Label>
                    <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                      {categories.map(category => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <RadioGroupItem value={category._id} id={`category_${category._id}`} />
                          <Label htmlFor={`category_${category._id}`}>{category.Name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
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

                  <div>
                    <Label>Ticket Prices</Label>
                    {ticketPrices.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <Input
                          value={ticket[0]}
                          onChange={(e) => {
                            const newTicketPrices = [...ticketPrices];
                            newTicketPrices[index][0] = e.target.value;
                            setTicketPrices(newTicketPrices);
                          }}
                          placeholder="Ticket Type"
                        />
                        <Input
                          type="number"
                          value={ticket[1]}
                          onChange={(e) => {
                            const newTicketPrices = [...ticketPrices];
                            newTicketPrices[index][1] = e.target.value ? parseFloat(e.target.value) : '';
                            setTicketPrices(newTicketPrices);
                          }}
                          placeholder="Price"
                        />
                        <Button
                          onClick={() => handleRemoveTicketPrice(index)}
                          variant="destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        value={newTicketType}
                        onChange={(e) => setNewTicketType(e.target.value)}
                        placeholder="New Ticket Type"
                      />
                      <Input
                        type="number"
                        value={newTicketPrice}
                        onChange={(e) => setNewTicketPrice(e.target.value)}
                        placeholder="New Price"
                      />
                      <Button onClick={handleAddTicketPrice}>Add</Button>
                    </div>
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
                  <Button type="submit" className="w-full">
                    Create Place
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePlace;

