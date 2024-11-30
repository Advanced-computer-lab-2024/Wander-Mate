'use client'

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { toast, Toaster } from "react-hot-toast"
import { Icon } from "@iconify/react"
import BasicMap from "./ui/basic-map" // No changes here, keeping it as is

const AddAdvertiserActivityModel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    Creator: "",
    Name: "",
    Date: "",
    Time: "",
    Location: {
      type: "Point",
      coordinates: [0, 0],
    },
    Price: "",
    Category: "",
    Tags: [],
    Discounts: [],
    IsAvailable: true,
  })
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingTags, setLoadingTags] = useState(true)
  const [selectedCategoryName, setSelectedCategoryName] = useState("")
  const [newDiscount, setNewDiscount] = useState({ percentage: "", description: "" })
  

  useEffect(() => {
    fetchCreatorId()
    fetchCategories()
    fetchTags()
  }, [])

  const fetchCreatorId = async () => {
    try {
      const username = sessionStorage.getItem("username")
      if (!username) {
        toast.error("Please log in to add activities.")
        return
      }

      const response = await fetch(`http://localhost:8000/getID/${username}`)
      if (!response.ok) throw new Error("Failed to fetch user ID")

      const { userID } = await response.json()
      setFormData((prev) => ({ ...prev, Creator: userID }))
    } catch (error) {
      console.error("Error fetching creator ID:", error)
      toast.error("Failed to retrieve user information. Please try logging in again.")
    }
  }

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch("http://localhost:8000/getCategories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Could not load categories. Please try again later.")
    } finally {
      setLoadingCategories(false)
    }
  }

  const fetchTags = async () => {
    try {
      setLoadingTags(true)
      const response = await fetch("http://localhost:8000/readPreferenceTags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast.error("Could not load tags. Please try again later.")
    } finally {
      setLoadingTags(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLocationSelect = (lng, lat) => {
    setFormData((prev) => ({
      ...prev,
      Location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    }))
  }

  const handleCategoryChange = (categoryId, categoryName) => {
    setFormData((prev) => ({ ...prev, Category: categoryName }))
    setSelectedCategoryName(categoryName)
  }

  const handleTagChange = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      Tags: prev.Tags.includes(tagId)
        ? prev.Tags.filter((id) => id !== tagId)
        : [...prev.Tags, tagId],
    }))
  }

  const handleAddDiscount = () => {
    const { percentage, description } = newDiscount
    if (!percentage || !description) {
      toast.error("Please fill both percentage and description.")
      return
    }
    setFormData((prev) => ({
      ...prev,
      Discounts: [...prev.Discounts, { percentage, description }],
    }))
    setNewDiscount({ percentage: "", description: "" })
  }

  const handleRemoveDiscount = (index) => {
    setFormData((prev) => ({
      ...prev,
      Discounts: prev.Discounts.filter((_, i) => i !== index),
    }))
  }

  const resetForm = () => {
    setFormData({
      Creator: formData.Creator,
      Name: "",
      Date: "",
      Time: "",
      Location: {
        type: "Point",
        coordinates: [0, 0],
      },
      Price: "",
      Category: "",
      Tags: [],
      Discounts: [],
      IsAvailable: true,
    })
    setSelectedCategoryName("")
    setIsOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.Creator) {
      toast.error("User ID not found. Please log in again.")
      return
    }

    if (!formData.Name || !formData.Date || !formData.Time || !formData.Price || !formData.Category) {
      toast.error("Please fill all required fields.")
      return
    }

    const submitData = {
      ...formData,
      DateString: formData.Date,
      Price: parseFloat(formData.Price),
    }

    try {
      const response = await fetch("http://localhost:8000/createActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        toast.success(`Activity "${formData.Name}" created successfully under the category "${selectedCategoryName}".`)
        resetForm()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Error adding activity")
      }
    } catch (error) {
      console.error("Error submitting activity:", error)
      toast.error("Failed to add activity")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Activity</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto" size="full">
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
            <div className="flex flex-col gap-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Name */}
                <div className="space-y-2">
                  <Label htmlFor="Name">Activity Name: <span className="text-red-500">*</span></Label>
                  <Input id="Name" name="Name" placeholder="Activity Name" required value={formData.Name} onChange={handleInputChange} />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="Date">Date: <span className="text-red-500">*</span></Label>
                  <Input id="Date" name="Date" type="date" required value={formData.Date} onChange={handleInputChange} />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="Time">Time: <span className="text-red-500">*</span></Label>
                  <Input id="Time" name="Time" type="time" required value={formData.Time} onChange={handleInputChange} />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="Price">Price: <span className="text-red-500">*</span></Label>
                  <Input id="Price" name="Price" type="number" placeholder="Activity Price" required value={formData.Price} onChange={handleInputChange} />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category: <span className="text-red-500">*</span></Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                    {loadingCategories ? (
                      <p>Loading categories...</p>
                    ) : (
                      categories.map((category) => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`category_${category._id}`}
                            name="category"
                            checked={formData.Category === category.Name}
                            onChange={() => handleCategoryChange(category._id, category.Name)}
                            className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`category_${category._id}`}>{category.Name}</label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags:</Label>
                <div className="flex flex-wrap gap-2">
                  {loadingTags ? (
                    <p>Loading tags...</p>
                  ) : (
                    tags.map((tag) => (
                      <div key={tag._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tag_${tag._id}`}
                          name="tags"
                          checked={formData.Tags.includes(tag._id)}
                          onChange={() => handleTagChange(tag._id)}
                          className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`tag_${tag._id}`}>{tag.Name}</label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location:</Label>
                <BasicMap onLocationSelect={handleLocationSelect} />
              </div>

              {/* Discounts */}
              <div className="space-y-2">
                <Label>Discounts:</Label>
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
                      <Label htmlFor="discountDescription">Description:</Label>
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
                    <Button type="button" onClick={handleAddDiscount}>
                      Add Discount
                    </Button>
                  </div>

                  {/* Display Discounts */}
                  <div className="space-y-2">
                    {formData.Discounts.length > 0 ? (
                      formData.Discounts.map((discount, index) => (
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
                            onClick={() => handleRemoveDiscount(index)}
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
                <Label>Availability:</Label>
                <Switch
                  checked={formData.IsAvailable}
                  onCheckedChange={(value) =>
                    setFormData((prev) => ({ ...prev, IsAvailable: value }))
                  }
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Add Activity
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddAdvertiserActivityModel
