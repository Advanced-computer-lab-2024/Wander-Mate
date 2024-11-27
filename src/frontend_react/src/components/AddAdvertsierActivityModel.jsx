'use client'

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { toast, Toaster } from "react-hot-toast"
import { Icon } from "@iconify/react"

const AddAdvertiserActivityModel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    Creator: "",
    Name: "",
    DateString: "",
    Time: "",
    Location: {
      type: "Point",
      coordinates: [0, 0]
    },
    Price: "",
    Category: "",
    Tags: [],
    Discounts: "",
    IsAvailable: true,
  })
  const [advertiserId, setAdvertiserId] = useState(null)

  useEffect(() => {
    // Get Advertiser ID from sessionStorage when the component mounts
    const storedAdvertiserId = sessionStorage.getItem("advertiserId")
    if (storedAdvertiserId) {
      setAdvertiserId(storedAdvertiserId)
      setFormData(prev => ({ ...prev, Creator: storedAdvertiserId }))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      Location: {
        ...prev.Location,
        coordinates: name === "longitude" 
          ? [parseFloat(value), prev.Location.coordinates[1]]
          : [prev.Location.coordinates[0], parseFloat(value)]
      }
    }))
  }

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim())
    setFormData(prev => ({ ...prev, Tags: tags }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8000/createActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const activityId = await response.json()
        toast.success("Activity added successfully")
        setFormData({
          Creator: advertiserId,
          Name: "",
          DateString: "",
          Time: "",
          Location: {
            type: "Point",
            coordinates: [0, 0]
          },
          Price: "",
          Category: "",
          Tags: [],
          Discounts: "",
          IsAvailable: true,
        })
        setIsOpen(false)
        // You might want to trigger a refresh of the activities list here
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Error adding activity")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to add activity")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Activity</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto">
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
                <div className="space-y-2">
                  <Label htmlFor="Name">Activity Name:</Label>
                  <Input
                    id="Name"
                    name="Name"
                    placeholder="Activity Name"
                    required
                    value={formData.Name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="DateString">Date:</Label>
                  <Input
                    id="DateString"
                    name="DateString"
                    type="date"
                    required
                    value={formData.DateString}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Time">Time:</Label>
                  <Input
                    id="Time"
                    name="Time"
                    type="time"
                    required
                    value={formData.Time}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Price">Price:</Label>
                  <Input
                    id="Price"
                    name="Price"
                    type="number"
                    placeholder="Activity Price"
                    required
                    value={formData.Price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Category">Category:</Label>
                  <Select
                    name="Category"
                    value={formData.Category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, Category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Tags">Tags (comma-separated):</Label>
                  <Input
                    id="Tags"
                    name="Tags"
                    placeholder="e.g., fun, exciting, family-friendly"
                    value={formData.Tags.join(', ')}
                    onChange={handleTagsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude:</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.000001"
                    required
                    value={formData.Location.coordinates[0]}
                    onChange={handleLocationChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude:</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.000001"
                    required
                    value={formData.Location.coordinates[1]}
                    onChange={handleLocationChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Discounts">Discounts:</Label>
                  <Input
                    id="Discounts"
                    name="Discounts"
                    placeholder="Any applicable discounts"
                    value={formData.Discounts}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="IsAvailable"
                    checked={formData.IsAvailable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, IsAvailable: checked }))}
                  />
                  <Label htmlFor="IsAvailable">Is Available</Label>
                </div>
              </div>

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

