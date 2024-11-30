import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Icon } from "@iconify/react";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import NonMovableMap from "./ui/nonMovableMap";
import BasicMap from "./ui/basic-map";
import { CustomPopover as Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import axios from "axios";

export default function AdvertiserActivityModal({
  activity,
  isOpen,
  setIsOpen,
  children,
}) {
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [updatedActivity, setUpdatedActivity] = useState({
    ...activity,
    discounts: activity.discounts || [], // Ensure discounts is always an array
  });
    const [categories, setCategories] = useState([]); // State for categories
  const [tags, setTags] = useState([]); // State for available tags
  const [selectedTags, setSelectedTags] = useState(activity.checkedTags); // State for selected tags
  const [loadingCategories, setLoadingCategories] = useState(false); // State for loading categories
  const [loadingTags, setLoadingTags] = useState(false); // State for loading tags
  const [newDiscount, setNewDiscount] = useState({ percentage: "", description: "" })

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch("http://localhost:8000/getCategories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();

        // Check if the response data is an array
        if (Array.isArray(data)) {
          setCategories(data); // Set categories in state
        } else {
          throw new Error("Fetched categories are not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Could not load categories. Please try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    // Fetch tags when component mounts
    const fetchTags = async () => {
      try {
        setLoadingTags(true);
        const response = await fetch("http://localhost:8000/readPreferenceTags");
        if (!response.ok) throw new Error("Failed to fetch tags");
        const data = await response.json();

        // Check if the response data is an array
        if (Array.isArray(data)) {
          setTags(data); // Set tags in state
        } else {
          throw new Error("Fetched tags are not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        alert("Could not load tags. Please try again later.");
      } finally {
        setLoadingTags(false);
      }
    };

    
    fetchCategories();
    fetchTags();
  }, []);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setIsBookingConfirmed(false);
    }
  };

  const handleBooking = () => {
    setIsBookingConfirmed(true);
  };
  const handleLocationSelect = (lat, lng) => {
    setUpdatedActivity((prev) => ({
      ...prev,
      location: {
        coordinates: [lat, lng], // Assuming the map provides latitude and longitude
      },
    }));
  };
  

  // Handle form submission to update the activity
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch("http://localhost:8000/updateActivity", {
        id: activity.activityId,
        Name: updatedActivity.name,
        Time : updatedActivity.time,
        DateString: updatedActivity.date,
        Location: {type: "Point", coordinates: updatedActivity.location.coordinates } ,
        Price:updatedActivity.price,
        Category:updatedActivity.category,
        Tags: selectedTags, // Send the selected tags
        Discounts:updatedActivity.discounts,
        IsAvailable:updatedActivity.isAvailable
      });
      alert(response.data.message);
      setIsEditing(false);
      setUpdatedActivity(response.data.activity); // Update the state with the response data
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || "Error updating activity");
    }
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTags((prevTags) => {
      if (checked) {
        return [...prevTags, value]; // Add selected tag
      } else {
        return prevTags.filter((tag) => tag !== value); // Remove unselected tag
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" size="full">
        <div className="relative">
          <Button variant="ghost" className="absolute right-0 top-0" onClick={() => handleOpenChange(false)}>
            <Icon icon="ph:x" className="h-4 w-4" />
          </Button>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Map Section */}
              <div>
                <Tabs defaultValue="location" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  <TabsContent value="location" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="w-full h-64 rounded-lg overflow-hidden">
                          {/* Conditionally render the map based on isEditing state */}
                          {isEditing ? (
                            <BasicMap onLocationSelect={handleLocationSelect} />
                          ) : (
                            <NonMovableMap
                              initialLocation={activity.location.coordinates.slice()}
                              onLocationSelect={() => {}} // Do nothing when in view mode
                            />
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            const [lat, lng] = activity.location.coordinates;
                            const mapUrl = `https://www.google.com/maps?q=${lng},${lat}`;
                            window.open(mapUrl, "_blank");
                          }}
                        >
                          <Icon icon="heroicons:location-marker" className="w-4 h-4 mr-2" />
                          Open in Maps
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>


              {/* Activity Details Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{activity.name}</h1>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Date:</span> {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Time:</span> {activity.time}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Category:</span> {activity.category || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Price:</span> ${activity.price}
                  </p>
                  {/* Display Discounts in View Mode */}
                  {activity.discounts && activity.discounts.length > 0 ? (
                    <div className="mb-3">
                      <p className="text-sm font-bold">Discounts:</p>
                      <ul className="list-disc pl-5">
                        {activity.discounts.map((discount, index) => (
                          <li key={index} className="text-sm text-green-600">
                            {discount.description}: {discount.percentage}% off
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {activity.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center mb-4">
                    <Icon
                      icon={activity.isAvailable ? "ph:check-circle" : "ph:x-circle"}
                      className={`w-5 h-5 ${activity.isAvailable ? "text-green-500" : "text-red-500"}`}
                    />
                    <span className="ml-2 text-sm">
                      {activity.isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>

                {/* Editable Form */}
                {isEditing && (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm text-gray-600">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={updatedActivity.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className="block text-sm text-gray-600">
                        Price
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={updatedActivity.price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>

                    <div>
                      <Label htmlFor="date" className="block text-sm text-gray-600">
                        Date
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={new Date(updatedActivity.date).toISOString().split('T')[0]}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>

                    {/* Time Input */}
                    <div>
                      <Label htmlFor="time" className="block text-sm text-gray-600">
                        Time
                      </Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={updatedActivity.time}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="block text-sm text-gray-600">
                        Category
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={updatedActivity.category} // This should be the category name
                        onChange={(e) => {
                          const selectedCategoryName = e.target.value;
                          setUpdatedActivity((prev) => ({
                            ...prev,
                            category: selectedCategoryName, // Update with the category name
                          }));
                        }}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        disabled={loadingCategories}
                      >
                        <option value="">Select a category</option>
                        {loadingCategories ? (
                          <option>Loading...</option>
                        ) : (
                          categories.map((category) => (
                            <option key={category._id} value={category.Name}>
                              {category.Name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>


                    {/* Tag Selection Section */}
                    <div>
                      <Label htmlFor="tags" className="block text-sm text-gray-600">
                        Tags
                      </Label>
                      <div className="space-y-2">
                        {loadingTags ? (
                          <p>Loading tags...</p>
                        ) : (
                          tags.map((tag) => (
                            <div key={tag._id} className="flex items-center">
                              <input
                                type="checkbox"
                                value={tag._id}
                                checked={selectedTags.includes(tag._id)}
                                onChange={handleTagChange}
                                className="mr-2"
                              />
                              <label>{tag.Name}</label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    {/* Discounts */}
                      <div className="space-y-2">
                        <label>Discounts:</label>
                        <div className="space-y-2 border rounded p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                              <Label htmlFor="discountPercentage">Percentage:</Label>
                              <Input
                                id="discountPercentage"
                                name="discountPercentage"
                                type="number"
                                placeholder="e.g., 10"
                                value={newDiscount.percentage}
                                onChange={(e) =>
                                  setNewDiscount((prev) => ({ ...prev, percentage: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="discountDescription">Description:</label>
                              <Input
                                id="discountDescription"
                                name="discountDescription"
                                type="text"
                                placeholder="e.g., Holiday Special"
                                value={newDiscount.description}
                                onChange={(e) =>
                                  setNewDiscount((prev) => ({ ...prev, description: e.target.value }))
                                }
                              />
                            </div>
                            <Button
                        type="button"
                        onClick={() => {
                          const { percentage, description } = newDiscount
                          if (!percentage || !description) {
                            return
                          }
                          setUpdatedActivity((prev) => ({
                            ...prev,
                            discounts: [...prev.discounts, { percentage, description }],
                          }))
                          setNewDiscount({ percentage: "", description: "" })
                          
                        }}
                      >
                        Add Discount
                      </Button>

                          </div>

                          {/* Display Discounts */}
                          <div className="space-y-2">
                            {updatedActivity.discounts && updatedActivity.discounts.length > 0 ? (
                              updatedActivity.discounts
                                .filter((d) => d.percentage && d.description) // Exclude temporary fields
                                .map((discount, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center border p-2 rounded"
                                  >
                                    <p>
                                      <strong>{discount.percentage}%</strong> - {discount.description}
                                    </p>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() => {
                                        const updatedDiscounts = updatedActivity.discounts.filter(
                                          (_, i) => i !== index
                                        );
                                        setUpdatedActivity((prev) => ({
                                          ...prev,
                                          discounts: updatedDiscounts,
                                        }));
                                      }}
                                    >
                                      <Icon icon="ph:trash" className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))
                            ) : (
                              <p className="text-sm text-gray-500">No discounts added yet.</p>
                            )}
                          </div>
                        </div>
                      </div>



                      {/* Availability */}
                      <div className="flex items-center gap-2">
                        <label>Availability:</label>
                        <Switch
                          checked={updatedActivity.isAvailable}
                          onCheckedChange={(value) =>
                            setUpdatedActivity((prev) => ({ ...prev, isAvailable: value }))
                          }
                        />
                      </div>
                      <div className="mt-4">
                        <Button type="submit">Update Activity</Button>
                      </div>
                    </form>
                  )}

                {/* Buttons Below */}
                {!isEditing && (
                  <div className="flex space-x-4 mt-6">


                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Activity
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
